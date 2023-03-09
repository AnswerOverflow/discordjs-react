import { MessageComponentInteraction } from "discord.js"
import { Container } from "./container"
import { Renderer } from "./renderer"
import {  ActionRowItem, MessageOptions } from "./message"

export class Node<Props> {
  readonly children = new Container<Node<unknown>>()
  public interaction?: MessageComponentInteraction = undefined
  public onComplete?: () => void = undefined
  constructor(public props: Props) { }

  public getActionRowItemData(): ActionRowItem {
    throw new Error("Not implemented"); // TODO: Probably should be abstract
  }
  modifyMessageOptions(options: MessageOptions) { }

  handleComponentInteraction(interaction: MessageComponentInteraction, onComplete: () => void): Node<unknown> | undefined {
    return undefined
  }


  completeInteraction() {
    this.interaction = undefined
    if(this.onComplete) this.onComplete()
  }

  get isDeferred() {
    return this.interaction?.deferred
  }

  get text(): string {
    return [...this.children].map((child) => child.text).join("")
  }
}
