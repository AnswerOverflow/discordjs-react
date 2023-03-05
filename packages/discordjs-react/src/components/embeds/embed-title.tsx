import type { ReactNode } from "react"
import React from "react"
import { DiscordJSReactElement } from "../../element"
import { Node, NodeTypes } from "../../node"
import { EmbedChildNode } from "./embed-child"
import type { EmbedOptions } from "./embed-options"

/**
 * @category Embed
 */
export type EmbedTitleProps = {
  children: ReactNode
  url?: string
}

/**
 * @category Embed
 */
export function EmbedTitle({ children, ...props }: EmbedTitleProps) {
  return (
    <DiscordJSReactElement props={props} createNode={() => new EmbedTitleNode(props)}>
      <DiscordJSReactElement props={{}} createNode={() => new TitleTextNode({})}>
        {children}
      </DiscordJSReactElement>
    </DiscordJSReactElement>
  )
}

class EmbedTitleNode extends EmbedChildNode<Omit<EmbedTitleProps, "children">> {
  override modifyEmbedOptions(options: EmbedOptions): void {
    options.title = this.children.findTypeFromTypeguard(
      isTitleTextNode
    )?.text ?? ""
    options.url = this.props.url
  }
}

function isTitleTextNode(node: Node<unknown>): node is TitleTextNode {
  return node.type === "EmbedTitleText"
}

class TitleTextNode extends Node<{}> {
  public type: NodeTypes = "EmbedTitleText"
}
