import { BaseMessageOptions, ButtonBuilder, ButtonComponentData, ButtonStyle, ChatInputCommandInteraction, ComponentType, Interaction, InteractionButtonComponentData, Message, MessageActionRowComponent, MessageActionRowComponentData, MessageComponentInteraction, MessagePayloadOption, RepliableInteraction, TextBasedChannel } from "discord.js";
import React from "react";
import { concatMap, Subject } from "rxjs";
import type { Except } from "type-fest";
import { EmbedOptions } from "./components/embeds/embed-options";
import { SelectProps } from "./components/select";
import { Container } from "./container";
import { last } from "./helpers/helpers";
import {Node} from "./node"
import { reconciler } from "./reconciler";

export type MessageOptions = {
  content: string
  embeds: EmbedOptions[]
  actionRows: ActionRow[]
}

export type ActionRow = ActionRowItem[]
export type ActionRowItem = MessageActionRowComponentData
export type MessageButtonOptions = {
  type: "button"
  customId: string
  label?: string
  style?: keyof typeof ButtonStyle
  disabled?: boolean
  emoji?: string
} 

export type MessageLinkOptions = {
  type: "link"
  url: string
  label?: string
  emoji?: string
  disabled?: boolean
}

export type MessageSelectOptions = Except<SelectProps, "children" | "value"> & {
  type: "select"
  customId: string
  options: MessageSelectOptionOptions[]
}

export type MessageSelectOptionOptions = {
  label: string
  value: string
  description?: string
  emoji?: string
}

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

type RendererOptions = 
| {
  type: "interaction"
  interaction: RendererableInteractions
  ephemeral: boolean
}
| { 
  type: "message"
  channel: TextBasedChannel
}
export type RendererableInteractions = MessageComponentInteraction | ChatInputCommandInteraction

export class Renderer {
  readonly nodes = new Container<Node<unknown>>()
  public message?: Message
  public active = true
  public updates = new Subject<UpdatePayload>()
  constructor(public options: RendererOptions, initialContent?: React.ReactNode) {
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
    if (initialContent) {
      reconciler.updateContainer(initialContent, container)
    }
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

  private getMessageOptions(): BaseMessageOptions {
    const options: MessageOptions = {
      content: "",
      embeds: [],
      actionRows: [],
    }
    for (const node of this.nodes) {
      node.modifyMessageOptions(options)
    }
    console.log(options.embeds)
    return {
      components: options.actionRows.map((row) => ({
        type: ComponentType.ActionRow,
        components: row,
      })),
      content: options.content,
      embeds: options.embeds,
    }
  }

  private async updateMessage(payload: UpdatePayload) {
    if (payload.action === "destroy") {
      this.updateSubscription.unsubscribe()
      await this.message?.delete()
      return
    }

    if (payload.action === "deactivate") {
      this.updateSubscription.unsubscribe()

      await this.message?.edit({
        ...payload.options,
        // TODO: Disable all components
        components: []
      })
      return
    }

    if (payload.action === "deferUpdate") {
      if(payload.interaction.deferred || payload.interaction.replied) return
      await payload.interaction.deferUpdate();      
      payload.renderer.render()
      return
    }

    // State update:
    if(payload.action === 'stateChange' && this.message){
      if(this.options.type === 'interaction'){
        await this.options.interaction.editReply(payload.options)
      } else {
        await this.message.edit(payload.options)
      }
      return      
    }

    if(payload.action === 'interactionComplete'){
      if(payload.interaction.deferred){
        await payload.interaction.editReply(payload.options)
        return
      }else {
        await payload.interaction.update(payload.options)
      }
      return
    }
    
    if(this.options.type === 'interaction') {
      const intr = this.options.interaction
      this.message = await intr.reply({
        ephemeral: this.options.ephemeral,
        fetchReply: true,
        ...payload.options
      })              
    }
  }
}
