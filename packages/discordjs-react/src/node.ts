import { Interaction, MessageComponentInteraction } from "discord.js"
import { Container } from "./container"
import { MessageOptions, Renderer } from "./renderer"


export class Node<Props> {
  readonly children = new Container<Node<unknown>>()
  public deferredInteractionId: string | undefined = undefined

  constructor(public props: Props) { }

  modifyMessageOptions(options: MessageOptions) { }

  handleComponentInteraction(interaction: MessageComponentInteraction, renderer: Renderer): Node<unknown> | undefined {
    return undefined
  }

  handleDeferred(interaction: MessageComponentInteraction) {
    this.deferredInteractionId = interaction.id
  }

  clearDeferred(interactionId: string) {
    if (this.deferredInteractionId === interactionId) {
      this.deferredInteractionId = undefined
      return true
    }
    return false;
  }

  get text(): string {
    return [...this.children].map((child) => child.text).join("")
  }
}
