import { MessageComponentInteraction } from "discord.js"
import { Container } from "./container"
import { Renderer } from "./renderer"
import { MessageOptions } from "./message"

export class Node<Props> {
  readonly children = new Container<Node<unknown>>()
  public interaction?: MessageComponentInteraction = undefined
  public onComplete?: () => void = undefined
  constructor(public props: Props) { }

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
