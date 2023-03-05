import React from "react"
import { DiscordJSReactElement } from "../../element"
import { isInstanceOf, omit } from "../../helpers/helpers"
import { Node } from "../../node"
import { MessageOptions } from "../../renderer"
import { TextNode } from "../text-node"
import { EmbedChildNode } from "./embed-child"
import type { EmbedOptions } from "./embed-options"
import { snakeCaseDeep } from "../../helpers/convert-case"
/**
 * @category Embed
 * @see https://discord.com/developers/docs/resources/channel#embed-object
 */
export type EmbedProps = {
  title?: string
  description?: string
  url?: string
  color?: number
  fields?: Array<{ name: string; value: string; inline?: boolean }>
  author?: { name: string; url?: string; iconUrl?: string }
  thumbnail?: { url: string }
  image?: { url: string }
  video?: { url: string }
  footer?: { text: string; iconUrl?: string }
  timestamp?: string | number | Date
  children?: React.ReactNode
}

/**
 * @category Embed
 * @see https://discord.com/developers/docs/resources/channel#embed-object
 */
export function Embed(props: EmbedProps) {
  return (
    <DiscordJSReactElement props={props} createNode={() => new EmbedNode(props)}>
      {props.children}
    </DiscordJSReactElement>
  )
}

class EmbedNode extends Node<EmbedProps> {
  override modifyMessageOptions(options: MessageOptions): void {
    const embed: EmbedOptions = {
      ...snakeCaseDeep(omit(this.props, ["children", "timestamp"])),
      timestamp: this.props.timestamp
        ? new Date(this.props.timestamp).toISOString()
        : undefined,
    }

    for (const child of this.children) {
      if (child instanceof EmbedChildNode) {
        child.modifyEmbedOptions(embed)
      }
      console.log(child, child instanceof TextNode)
      if (child instanceof TextNode) {
        embed.description = (embed.description || "") + child.props
      }
    }

    options.embeds.push(embed)
  }
}
