import React from "react"
import { DiscordJSReactElement } from "../../element"
import { EmbedChildNode } from "./embed-child"
import type { EmbedOptions } from "./embed-options"

/**
 * @category Embed
 */
export type EmbedImageProps = {
  url: string
}

/**
 * @category Embed
 */
export function EmbedImage(props: EmbedImageProps) {
  return (
    <DiscordJSReactElement
      props={props}
      createNode={() => new EmbedImageNode(props)}
    />
  )
}

class EmbedImageNode extends EmbedChildNode<EmbedImageProps> {
  override modifyEmbedOptions(options: EmbedOptions): void {
    options.image = { url: this.props.url }
  }
}
