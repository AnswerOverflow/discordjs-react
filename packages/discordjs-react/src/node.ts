import { MessageComponentInteraction } from "discord.js"
import { Container } from "./container"
import { MessageOptions, Renderer } from "./renderer"

// For some reason isinstance is broken, so we have to do this, its ugly
// if you are reading this, submit a PR to fix it please god
export const embedChildTypes = ["EmbedAuthor", "EmbedAuthorText", "EmbedField", "EmbedFieldName", "EmbedFieldValue", "EmbedFooter", "EmbedFooterText", "EmbedImage", "EmbedImageText", "EmbedThumbnail", "EmbedThumbnailText", "EmbedTitle", "EmbedTitleText"] as const
export const embedTypes = [...embedChildTypes, "EmbedChild", "EmbedOption", "Embed"] as const
export const nodeTypes = [...embedTypes, "ActionRow", "Button", "ButtonLabel", "Link", "LinkLabel", "Select", "SelectLabel", "Option", "OptionDescription", "OptionLabel", "Text", "Node"] as const
export type NodeTypes = typeof nodeTypes[number]

export function isNodeTypeguard<Props>(node: Node<unknown>): node is Node<Props> {
  return nodeTypes.includes(node.type)
}


export class Node<Props> {
  readonly children = new Container<Node<unknown>>()
  public type: NodeTypes = "Node"
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
