import type { ReactNode } from "react"
import React from "react"
import { DiscordJSReactElement } from "../../element"
import { Node, NodeTypes } from "../../node"
import { EmbedChildNode } from "./embed-child"
import type { EmbedOptions } from "./embed-options"

/**
 * @category Embed
 */
export type EmbedFooterProps = {
  text?: ReactNode
  children?: ReactNode
  iconUrl?: string
  timestamp?: string | number | Date
}

/**
 * @category Embed
 */
export function EmbedFooter({ text, children, ...props }: EmbedFooterProps) {
  return (
    <DiscordJSReactElement props={props} createNode={() => new EmbedFooterNode(props)}>
      <DiscordJSReactElement props={{}} createNode={() => new FooterTextNode({})}>
        {text ?? children}
      </DiscordJSReactElement>
    </DiscordJSReactElement>
  )
}

class EmbedFooterNode extends EmbedChildNode<
  Omit<EmbedFooterProps, "text" | "children">
> {
  override modifyEmbedOptions(options: EmbedOptions): void {
    options.footer = {
      text: this.children.findTypeFromTypeguard(isFooterTextNode)?.text ?? "",
      icon_url: this.props.iconUrl,
    }
    options.timestamp = this.props.timestamp
      ? new Date(this.props.timestamp).toISOString()
      : undefined
  }
}


function isFooterTextNode(node: Node<unknown>): node is FooterTextNode {
  return node.type === "EmbedFooterText"
}

class FooterTextNode extends Node<{}> {
  public type: NodeTypes = "EmbedFooterText"
}
