import type { ReactNode } from "react"
import React from "react"
import type { Node } from "./node"

export function DiscordJSReactElement<Props>(props: {
  props: Props
  createNode: () => Node<Props>
  children?: ReactNode
}) {
  return React.createElement("reacord-element", props)
}
