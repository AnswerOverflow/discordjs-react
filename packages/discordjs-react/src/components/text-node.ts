
import { Node } from "../node"
import { MessageOptions } from "../message"

export class TextNode extends Node<string> {
  override modifyMessageOptions(options: MessageOptions) {
    options.content = options.content + this.props
  }

  override get text() {
    return this.props
  }
}
