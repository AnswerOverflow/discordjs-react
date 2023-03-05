import React from "react"
import { DiscordJSReactElement } from "../../element"
import { EmbedChildNode } from "./embed-child"
import type { EmbedOptions } from "./embed-options"

/**
 * @category Embed
 */
export type EmbedThumbnailProps = {
  url: string
}

/**
 * @category Embed
 */
export function EmbedThumbnail(props: EmbedThumbnailProps) {
  return (
    <DiscordJSReactElement
      props={props}
      createNode={() => new EmbedThumbnailNode(props)}
    />
  )
}

class EmbedThumbnailNode extends EmbedChildNode<EmbedThumbnailProps> {
  override modifyEmbedOptions(options: EmbedOptions): void {
    options.thumbnail = { url: this.props.url }
  }
}
