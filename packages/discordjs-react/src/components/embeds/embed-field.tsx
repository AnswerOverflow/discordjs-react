import type { ReactNode } from "react"
import React from "react"
import { DiscordJSReactElement } from "../../element"
import { Node, NodeTypes } from "../../node"
import { EmbedChildNode } from "./embed-child"
import type { EmbedOptions } from "./embed-options"

/**
 * @category Embed
 */
export type EmbedFieldProps = {
  name: ReactNode
  value?: ReactNode
  inline?: boolean
  children?: ReactNode
}

/**
 * @category Embed
 */
export function EmbedField(props: EmbedFieldProps) {
  return (
    <DiscordJSReactElement props={props} createNode={() => new EmbedFieldNode(props)}>
      <DiscordJSReactElement props={{}} createNode={() => new FieldNameNode({})}>
        {props.name}
      </DiscordJSReactElement>
      <DiscordJSReactElement props={{}} createNode={() => new FieldValueNode({})}>
        {props.value || props.children}
      </DiscordJSReactElement>
    </DiscordJSReactElement>
  )
}

class EmbedFieldNode extends EmbedChildNode<EmbedFieldProps> {
  override modifyEmbedOptions(options: EmbedOptions): void {
    options.fields ??= []
    options.fields.push({
      name: this.children.findTypeFromTypeguard(isFieldNameNode)?.text ?? "",
      value: this.children.findTypeFromTypeguard(isFieldValueNode)?.text ?? "",
      inline: this.props.inline,
    })
  }
}



function isFieldNameNode(node: Node<unknown>): node is FieldNameNode {
  return node.type === "EmbedFieldName"
}
class FieldNameNode extends Node<{}> {
  public type: NodeTypes = "EmbedFieldName"
}

function isFieldValueNode(node: Node<unknown>): node is FieldValueNode {
  return node.type === "EmbedFieldValue"
}
class FieldValueNode extends Node<{}> {
  public type: NodeTypes = "EmbedFieldValue"
}
