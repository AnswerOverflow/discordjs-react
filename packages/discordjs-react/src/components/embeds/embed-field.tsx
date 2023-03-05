import type { ReactNode } from "react"
import React from "react"
import { DiscordJSReactElement } from "../../element"
import { Node } from "../../node"
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
      name: this.children.findType(FieldNameNode)?.text ?? "",
      value: this.children.findType(FieldValueNode)?.text ?? "",
      inline: this.props.inline,
    })
  }
}

class FieldNameNode extends Node<{}> { }
class FieldValueNode extends Node<{}> { }
