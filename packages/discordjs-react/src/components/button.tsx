import { randomUUID } from "node:crypto"
import React from "react"
import { DiscordJSReactElement } from "../../internal/element.js"
import type { ComponentInteraction } from "../../internal/interaction"
import type { ActionRowItem, MessageOptions } from "../../internal/message"
import { getNextActionRow } from "../../internal/message"
import { Node } from "../node"
import type { Renderer } from "../../internal/renderers/renderer.js"
import type { ComponentEvent } from "../component-event"
import type { ButtonSharedProps } from "./button-shared-props"

/**
 * @category Button
 */
export type ButtonProps = ButtonSharedProps & {
  /**
   * The style determines the color of the button and signals intent.
   * @see https://discord.com/developers/docs/interactions/message-components#button-object-button-styles
   */
  style?: "primary" | "secondary" | "success" | "danger"

  /**
   * Happens when a user clicks the button.
   */
  onClick: (event: ButtonClickEvent) => Promise<void> | void
}

/**
 * @category Button
 */
export type ButtonClickEvent = ComponentEvent

/**
 * @category Button
 */
export function Button(props: ButtonProps) {
  return (
    <DiscordJSReactElement props={props} createNode={() => new ButtonNode(props)}>
      <DiscordJSReactElement props={{}} createNode={() => new ButtonLabelNode({})}>
        {props.label}
      </DiscordJSReactElement>
    </DiscordJSReactElement>
  )
}

class ButtonNode extends Node<ButtonProps> {
  private customId = randomUUID()
  // this has text children, but buttons themselves shouldn't yield text
  // eslint-disable-next-line class-methods-use-this
  override get text() {
    return ""
  }

  override modifyMessageOptions(options: MessageOptions): void {
    const opts: ActionRowItem = {
      type: "button",
      customId: this.customId,
      style: this.props.style ?? "secondary",
      disabled: (this.props.disabled || this.deferredInteractionId !== undefined),
      emoji: (this.deferredInteractionId ? "<a:loading:1081524604419453028" : this.props.emoji),
      label: this.children.findType(ButtonLabelNode)?.text,
    }
    getNextActionRow(options).push(opts)
  }

  override handleComponentInteraction(interaction: ComponentInteraction, renderer: Renderer) {
    if (
      interaction.type === "button" &&
      interaction.customId === this.customId
    ) {
      void Promise.resolve(
        this.props.onClick(interaction.event)
      ).then(
        () => {
          this.clearDeferred(interaction.id)
          // renderer.render()
        },
      )
      return this
    }
    return undefined
  }
}

class ButtonLabelNode extends Node<{}> { }
