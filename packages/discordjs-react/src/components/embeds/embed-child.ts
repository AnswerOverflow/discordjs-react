import type { EmbedOptions } from "./embed-options"
import { Node } from "../../node"
export abstract class EmbedChildNode<Props> extends Node<Props> {
  abstract modifyEmbedOptions(options: EmbedOptions): void
}
