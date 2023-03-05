import { MessageComponentInteraction } from "discord.js"
import { Container } from "./container"
import { MessageOptions, Renderer } from "./renderer"

export function isNodeTypeguard<Props>(node: Node<unknown>, type: new (props: Props) => Node<Props>): node is Node<Props> {
  return node instanceof type
}

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
