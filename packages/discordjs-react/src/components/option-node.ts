
import { Node, NodeTypes } from "../node"
import { MessageSelectOptionOptions } from "../renderer"
import type { OptionProps } from "./option"

export function isOptionNodeTypeguard(node: Node<unknown>): node is OptionNode {
  return node.type === "Option"
}

export class OptionNode extends Node<
Omit<OptionProps, "children" | "label" | "description">
> {
  get options(): MessageSelectOptionOptions {
    return {
      label: this.children.findTypeFromTypeguard(isOptionLabelNodeTypeguard)?.text ?? "",
      value: this.props.value,
      description: this.children.findTypeFromTypeguard(isOptionValueNodeTypeguard)?.text ?? "",
      emoji: this.props.emoji,
    }
  }
}

function isOptionLabelNodeTypeguard(node: Node<unknown>): node is OptionLabelNode {
  return node.type === "OptionLabel"
}

export class OptionLabelNode extends Node<{}> {
  public type: NodeTypes = "OptionLabel"
}

function isOptionValueNodeTypeguard(node: Node<unknown>): node is OptionDescriptionNode {
  return node.type === "OptionDescription"
}

export class OptionDescriptionNode extends Node<{}> {
  public type: NodeTypes = "OptionDescription"
}
