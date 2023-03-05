import type { ReactNode } from "react"
import React from "react"
import { DiscordJSReactElement } from "../../element"
import { EmbedChildNode } from "./embed-child"
import { EmbedOptions } from "./embed-options"
import { Node, NodeTypes } from "../../node"

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
      name: this.children.findTypeFromTypeguard(isAuthorTextNode)?.text ?? "",
      url: this.props.url,
      icon_url: this.props.iconUrl,
    }
  }
}

function isAuthorTextNode(node: Node<unknown>): node is AuthorTextNode {
  return node.type === "EmbedAuthorText"
}

class AuthorTextNode extends Node<{}> {
  public type: NodeTypes = "EmbedAuthorText"
}
