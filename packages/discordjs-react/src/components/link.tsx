import { ActionRowComponentOptions, ButtonComponentData, ButtonStyle, ComponentType } from "discord.js"
import React from "react"
import { DiscordJSReactElement } from "../element"

import { Node } from "../node"
import { getNextActionRow } from "../renderer"
import { MessageOptions } from "../message"
import type { ButtonSharedProps } from "./button-shared-props"

/**
 * @category Link
 */
export type LinkProps = ButtonSharedProps & {
  /** The URL the link should lead to */
  url: string
  /** The link text */
  children?: string
}

/**
 * @category Link
 */
export function Link({ label, children, ...props }: LinkProps) {
  return (
    <DiscordJSReactElement props={props} createNode={() => new LinkNode(props)}>
      <DiscordJSReactElement props={{}} createNode={() => new LinkTextNode({})}>
        {label || children}
      </DiscordJSReactElement>
    </DiscordJSReactElement>
  )
}

export class LinkNode extends Node<Omit<LinkProps, "children">> {
  override getActionRowItemData(): ButtonComponentData {
    return {
      type: ComponentType.Button,
      style: ButtonStyle.Link,
      disabled: this.props.disabled,
      emoji: this.props.emoji,
      label: this.children.findType(LinkTextNode)?.text ?? "",
      url: this.props.url,
    }
  }
  override modifyMessageOptions(options: MessageOptions): void {
    getNextActionRow(options).push(
      this.getActionRowItemData()
    )
  }
}

class LinkTextNode extends Node<{}> {
}
