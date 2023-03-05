import type { ReactNode } from "react"
import React from "react"
import { DiscordJSReactElement } from "../element"
import { EmbedChildNode } from "./embeds/embed-child"
import { EmbedOptions } from "./embeds/embed-options"


/**
 * @category Embed
 */
export type EmbedAuthorProps = {
  name?: ReactNode
  children?: ReactNode
  url?: string
  iconUrl?: string
}

/**
 * @category Embed
 */
export function EmbedAuthor(props: EmbedAuthorProps) {
  return (
    <DiscordJSReactElement props={props} createNode={() => new EmbedAuthorNode(props)}>
      <DiscordJSReactElement props={{}} createNode={() => new AuthorTextNode({})}>
        {props.name ?? props.children}
      </DiscordJSReactElement>
    </DiscordJSReactElement>
  )
}

class EmbedAuthorNode extends EmbedChildNode<EmbedAuthorProps> {
  override modifyEmbedOptions(options: EmbedOptions): void {
    options.author = {
      name: this.children.findType(AuthorTextNode)?.text ?? "",
      url: this.props.url,
      icon_url: this.props.iconUrl,
    }
  }
}

class AuthorTextNode extends Node<{}> { }
