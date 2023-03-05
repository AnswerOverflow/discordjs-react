import type { ReactNode } from "react"
import React from "react"
import { DiscordJSReactElement } from "../element"
import { MessageOptions, Renderer } from "../renderer"
import { Node } from "../node"
import { MessageComponentInteraction } from "discord.js"

/**
 * Props for an action row
 * @category Action Row
 */
export type ActionRowProps = {
  children?: ReactNode
}

/**
 * An action row is a top-level container for message components.
 *
 * You don't need to use this; Reacord automatically creates action rows for you.
 * But this can be useful if you want a specific layout.
 *
 * ```tsx
 * // put buttons on two separate rows
 * <ActionRow>
 *   <Button label="First" onClick={handleFirst} />
 * </ActionRow>
 * <Button label="Second" onClick={handleSecond} />
 * ```
 *
 * @category Action Row
 * @see https://discord.com/developers/docs/interactions/message-components#action-rows
 */
export function ActionRow(props: ActionRowProps) {
  return (
    <DiscordJSReactElement props={props} createNode={() => new ActionRowNode(props)}>
      {props.children}
    </DiscordJSReactElement>
  )
}

class ActionRowNode extends Node<{}> {
  override modifyMessageOptions(options: MessageOptions): void {
    options.actionRows.push([])
    for (const child of this.children) {
      child.modifyMessageOptions(options)
    }
  }
  override handleComponentInteraction(interaction: MessageComponentInteraction, renderer: Renderer) {
    for (const child of this.children) {
      const handler = child.handleComponentInteraction(interaction, renderer)
      if (handler) {
        return handler
      }
    }
    return undefined
  }

  override completeInteraction(interactionId: string): boolean {
    for (const child of this.children) {
      if (child.completeInteraction(interactionId)) {
        return true
      }
    }
    return false
  }
}
