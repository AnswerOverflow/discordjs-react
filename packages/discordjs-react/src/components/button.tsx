import { ButtonInteraction, ButtonStyle, ComponentType, MessageComponentInteraction } from "discord.js"
import { randomUUID } from "node:crypto"
import React from "react"
import { DiscordJSReactElement } from "../element"
import { Node, NodeTypes } from "../node"
import { ActionRowItem, getNextActionRow, MessageOptions, Renderer } from "../renderer"
import type { ButtonSharedProps } from "./button-shared-props"

/**
 * @category Button
 */
export type ButtonProps = ButtonSharedProps & {
  /**
   * The style determines the color of the button and signals intent.
   * @see https://discord.com/developers/docs/interactions/message-components#button-object-button-styles
   */
  style?: keyof Omit<typeof ButtonStyle, 'Link'>,

  /**
   * Happens when a user clicks the button.
   */
  onClick: (interaction: ButtonInteraction) => Promise<void> | void
}

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
    const buttonStyle = this.props.style
    const opts: ActionRowItem = {
      type: ComponentType.Button,
      customId: this.customId,
      style: buttonStyle ? ButtonStyle[buttonStyle] : ButtonStyle.Secondary,
      disabled: (this.props.disabled || this.isDeferred !== undefined),
      emoji: (this.isDeferred ? "<a:loading:1081524604419453028" : this.props.emoji),
      label: this.children.findTypeFromTypeguard(isButtonLabelNode)?.text
    }
    getNextActionRow(options).push(opts)
  }

  override handleComponentInteraction(interaction: MessageComponentInteraction, onComplete: () => void) {
    const shouldHandleInteraction = interaction.isButton() && interaction.customId === this.customId
    if (!shouldHandleInteraction)
      return undefined

    this.interaction = interaction
    this.onComplete = onComplete
    const wrappedClick = async () => {
      await this.props.onClick(interaction)
      this.completeInteraction()
    }
    void Promise.resolve(
      wrappedClick()
    )
    return this
  }
}

function isButtonLabelNode(node: Node<unknown>): node is ButtonLabelNode {
  return node.type === "ButtonLabel"
}

class ButtonLabelNode extends Node<{}> {
  public type: NodeTypes = "ButtonLabel"
}
