import { ChatInputCommandInteraction, Interaction, Message, MessageComponentInteraction, MessagePayloadOption, RepliableInteraction } from "discord.js";
import React from "react";
import { concatMap, Subject } from "rxjs";
import type { Except } from "type-fest";
import { EmbedOptions } from "./components/embeds/embed-options";
import { SelectProps } from "./components/select";
import { Container } from "./container";
import { repliedInteractionIds } from "./discordjs-react";
import {Node} from "./node"
import { reconciler } from "./reconciler";

export type MessageOptions = {
  content: string
  embeds: EmbedOptions[]
  actionRows: ActionRow[]
}

export type ActionRow = ActionRowItem[]

export type ActionRowItem =
  | MessageButtonOptions
  | MessageLinkOptions
  | MessageSelectOptions

export type MessageButtonOptions = {
  type: "button"
  customId: string
  label?: string
  style?: "primary" | "secondary" | "success" | "danger"
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


type UpdatePayload =
  | { action: "update" | "deactivate"; options: MessageOptions }
  | { action: "deferUpdate"; interaction: MessageComponentInteraction; node: Node<unknown>; renderer: Renderer }
  | { action: "destroy" }

export type RendererableInteractions = MessageComponentInteraction | ChatInputCommandInteraction

export abstract class Renderer {
  readonly nodes = new Container<Node<unknown>>()
  public message?: Message
  public active = true
  public updates = new Subject<UpdatePayload>()

  constructor(initialContent?: React.ReactNode, public interaction?: RendererableInteractions) {
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
    console.log("initialContent", initialContent)
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
      action: "update",
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
      const handler = node.handleComponentInteraction(interaction, this)
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

  protected abstract createMessage(options: MessageOptions): Promise<Message> | Message;

  private getMessageOptions(): MessageOptions {
    const options: MessageOptions = {
      content: "",
      embeds: [],
      actionRows: [],
    }
    for (const node of this.nodes) {
      node.modifyMessageOptions(options)
    }
    return options
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
      const deferred = await payload.interaction.deferUpdate()
      if (!deferred) return
      repliedInteractionIds.add(payload.interaction.id)
      payload.node.handleDeferred(payload.interaction);
      payload.renderer.render()
      return
    }


    // TODO: This is wrong
    // if (this.interaction?.replied) {
    //   if(this.interaction.isMessageComponent()){
    //     const promise = this.interaction.update(payload.options)
    //     this.interaction = undefined
    //     await promise
    //   } else {
    //     await this.interaction.editReply(payload.options)
    //     this.interaction = undefined
    //   }
    //   return
    // }

    if (this.message) {
      await this.message.edit(payload.options)
      return
    }

    console.log(this.interaction)

    this.message = await this.createMessage(payload.options)
  }
}
