
import { Node} from "../node"
import { MessageSelectOptionOptions } from "../message"
import type { OptionProps } from "./option"

export class OptionNode extends Node<
Omit<OptionProps, "children" | "label" | "description">
> {
  get options(): MessageSelectOptionOptions {
    return {
      label: this.children.findType(OptionLabelNode)?.text ?? "",
      value: this.props.value,
      description: this.children.findType(OptionDescriptionNode)?.text ?? "",
      emoji: this.props.emoji,      
   
    }
  }
}

export class OptionLabelNode extends Node<{}> {
}

export class OptionDescriptionNode extends Node<{}> {
}
