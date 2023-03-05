
import { Node, NodeTypes } from "../node"
import { MessageOptions } from "../message"

export function isTextNodeTypeguard(node: Node<unknown>): node is TextNode {
  return node.type === 'Text'
}

export class TextNode extends Node<string> {
  public type: NodeTypes = "Text"  
  override modifyMessageOptions(options: MessageOptions) {
    options.content = options.content + this.props
  }

  override get text() {
    return this.props
  }
}
