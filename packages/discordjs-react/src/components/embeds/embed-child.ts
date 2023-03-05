import type { EmbedOptions } from "./embed-options"
import { embedChildTypes, Node } from "../../node"

export function isEmbedChildNodeTypeguard<Props>(node: Node<unknown>): node is EmbedChildNode<Props> {
  return embedChildTypes.includes(node.type as any)
}

export abstract class EmbedChildNode<Props> extends Node<Props> {
  abstract modifyEmbedOptions(options: EmbedOptions): void
}
