import { ActionRowComponentOptions, ButtonComponentData, ButtonInteraction, ButtonStyle, ComponentType, MessageComponentInteraction } from "discord.js"
import { randomUUID } from "node:crypto"
import React from "react"
import { DiscordJSReactElement } from "../element"
import { Node } from "../node"
import { getNextActionRow, LOADING_EMOJI, Renderer } from "../renderer"
import { ActionRowItem, MessageOptions } from "../message"
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
  onClick: (interaction: ButtonInteraction) => Promise<unknown> | unknown
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

export class ButtonNode extends Node<ButtonProps> {
  public customId = randomUUID()
  // this has text children, but buttons themselves shouldn't yield text
  // eslint-disable-next-line class-methods-use-this
  override get text() {
    return ""
  }

  override getActionRowItemData(): ButtonComponentData {
    const buttonStyle = this.props.style
    const opts: ActionRowItem = {
      type: ComponentType.Button,
      customId: this.customId,
      style: buttonStyle ? ButtonStyle[buttonStyle] : ButtonStyle.Secondary,
      disabled: (this.props.disabled || this.isDeferred !== undefined),
      emoji: (this.isDeferred ? LOADING_EMOJI : this.props.emoji),
      label: this.children.findType(ButtonLabelNode)?.text
    }
    return opts
  }

  override modifyMessageOptions(options: MessageOptions): void {
    getNextActionRow(options).push(
      this.getActionRowItemData()
    )
  }

  override handleComponentInteraction(interaction: MessageComponentInteraction, onComplete: () => void) {
    const shouldHandleInteraction = interaction.isButton() && interaction.customId === this.customId
    if (!shouldHandleInteraction)
      return undefined

    this.interaction = interaction
    this.onComplete = onComplete
    Promise.resolve(this.props.onClick(interaction)).then(
      () => this.completeInteraction()
    ).catch(
      (err) => {
        throw err
      }
    )
    return this
  }
}

class ButtonLabelNode extends Node<{}> {
}
