import { ActionRowComponentOptions, ActionRowData, BaseMessageOptions, ButtonBuilder, ButtonComponentData, ChatInputCommandInteraction, Client, ComponentType, Interaction, InteractionButtonComponentData, Message, MessageActionRowComponent, MessageActionRowComponentBuilder, MessageActionRowComponentData, MessageComponentInteraction, MessagePayloadOption, RepliableInteraction, TextBasedChannel } from "discord.js";
import React, { ReactNode } from "react";
import { concatMap, Subject } from "rxjs";
import { Container } from "./container";
import { last } from "./helpers/helpers";
import { Node } from "./node"
import { reconciler } from "./reconciler";
import { MessageOptions, ActionRow, DiscordJSReactMessage } from "./message";
import { randomUUID } from "crypto";
import { DiscordJSReact, RendererWrapper } from "./discordjs-react";
export function getNextActionRow(options: MessageOptions): ActionRow {
  let actionRow = last(options.actionRows)
  const firstItem = actionRow?.[0]
  if (
    actionRow == undefined ||
    actionRow.length >= 5 ||
    firstItem && 'type' in firstItem && firstItem.type === ComponentType.StringSelect
  ) {
    actionRow = []
    options.actionRows.push(actionRow)
  }
  return actionRow
}


type UpdatePayload =
  | { action: "stateChange" | "deactivate"; options: BaseMessageOptions }
  | { action: "deferUpdate"; interaction: MessageComponentInteraction; node: Node<unknown>; renderer: Renderer }
  | { action: "destroy" }
  | { action: "interactionComplete"; interaction: MessageComponentInteraction; options: BaseMessageOptions }


export type RendererOptions =
  (| {
    type: "interaction"
    interaction: RendererableInteractions
    ephemeral: boolean
  }
    | {
      type: "message"
      channel: TextBasedChannel
    })
export type RendererableInteractions = MessageComponentInteraction | ChatInputCommandInteraction

export const LOADING_EMOJI = "<a:loading:1081524604419453028>"

const InstanceContext = React.createContext<Renderer | undefined>(undefined)

export function useInstance() {
  const instance = React.useContext(InstanceContext)
  if (instance == undefined) {
    throw new Error("Attempted to useInstance outside of a renderer")
  }
  return instance
}

export class Renderer {
  readonly nodes = new Container<Node<unknown>>()
  public message?: DiscordJSReactMessage
  public active = true
  public updates = new Subject<UpdatePayload>()
  public rendererId = randomUUID();
  constructor(public options: RendererOptions, public discordJSReact: DiscordJSReact, initialContent?: React.ReactNode) {
    const container = reconciler.createContainer(
      this,
      0,
      // eslint-disable-next-line unicorn/no-null
      null,
      false,
      // eslint-disable-next-line unicorn/no-null
      null,
      "reacord",
      () => { },
      // eslint-disable-next-line unicorn/no-null
      null,
    )
    reconciler.updateContainer(
      (
        <InstanceContext.Provider value={this}>
          <discordJSReact.config.wrapper>
            {initialContent}
          </discordJSReact.config.wrapper>
        </InstanceContext.Provider>
      ), container)
  }

  private updateSubscription = this.updates
    .pipe(concatMap((payload) => this.updateMessage(payload)))
    .subscribe({ error: console.error })

  render() {
    if (!this.active) {
      console.warn("Attempted to update a deactivated message")
      return
    }

    this.updates.next({
      options: this.getMessageOptions(),
      action: "stateChange",
    })
  }

  deactivate() {
    this.active = false
    this.updates.next({
      options: this.getMessageOptions(),
      action: "deactivate",
    })
  }

  destroy() {
    this.active = false
    this.updates.next({ action: "destroy" })
  }

  handleComponentInteraction(interaction: MessageComponentInteraction) {
    for (const node of this.nodes) {
      const handler = node.handleComponentInteraction(interaction, () => {
        this.updates.next({
          options: this.getMessageOptions(),
          action: "interactionComplete",
          interaction,
        })
      })
      if (handler) {
        // TODO: Add another set timeout to handle failing deferred interactions
        setTimeout(() => {
          this.updates.next({ action: "deferUpdate", interaction, node: handler, renderer: this })
        }, 2000) // We have to respond within 3 seconds, so we wait 2 seconds to give the interaction time to run then fallback to the long running task
        return handler
      }
    }
    return undefined
  }


  protected getMessageOptions(): BaseMessageOptions & {
    components: ActionRowData<ActionRowComponentOptions>[]
  } {
    const options: MessageOptions = {
      content: "",
      embeds: [],
      actionRows: [],
    }
    for (const node of this.nodes) {
      node.modifyMessageOptions(options)
    }
    return {
      components: options.actionRows.map((row) => ({
        type: ComponentType.ActionRow,
        components: row,
      })),
      content: options.content,
      embeds: options.embeds,
    }
  }

  protected trackMessage(message: Message) {
    this.message = new DiscordJSReactMessage(message, this)
  }

  private async updateMessage(payload: UpdatePayload) {
    if (payload.action === "destroy") {
      this.updateSubscription.unsubscribe()
      await this.message?.raw.delete()
      return
    }

    if (payload.action === "deactivate") {
      this.updateSubscription.unsubscribe()

      await this.message?.raw.edit({
        ...payload.options,
        // TODO: Disable all components
        components: []
      })
      return
    }

    if (payload.action === "deferUpdate") {
      if (payload.interaction.deferred || payload.interaction.replied) return
      await payload.interaction.deferUpdate();
      payload.renderer.render()
      return
    }

    // State update:
    if (payload.action === 'stateChange' && this.message) {
      if (this.options.type === 'interaction') {
        await this.options.interaction.editReply(payload.options)
      } else {
        await this.message.raw.edit(payload.options)
      }
      return
    }

    if (payload.action === 'interactionComplete') {
      if (this.discordJSReact.renderers.find(r => r.options.type === 'interaction' && r.options.interaction.id === payload.interaction.id))
        return // If another renderer is handling this interaction, we don't want to update the message
      if (payload.interaction.replied) {
        return
      }
      if (payload.interaction.deferred) {
        await payload.interaction.editReply(payload.options)
        return
      } else {
        await payload.interaction.update(payload.options)
      }
      return
    }

    if (this.options.type === 'interaction') {
      const intr = this.options.interaction
      if (intr.deferred || intr.replied) {
        await intr.editReply(payload.options)
        return
      }
      const created = await intr.reply({
        ephemeral: this.options.ephemeral,
        fetchReply: true,
        ...payload.options
      })
      this.trackMessage(created)
    }
  }
}
