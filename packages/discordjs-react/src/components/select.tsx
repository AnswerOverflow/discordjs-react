
import { ComponentType, MessageComponentInteraction, SelectMenuComponentOptionData, StringSelectMenuComponentData, StringSelectMenuInteraction } from "discord.js"
import { randomUUID } from "node:crypto"
import type { ReactNode } from "react"
import React from "react"
import { DiscordJSReactElement } from "../element"

import { Node } from "../node"
import { MessageOptions, ActionRowItem, ActionRow } from "../renderer"

import { isOptionNodeTypeguard, OptionNode } from "./option-node"

/**
 * @category Select
 */
export type SelectProps = {
  children?: ReactNode
  /** Sets the currently selected value */
  value?: string

  /** Sets the currently selected values, for use with `multiple` */
  values?: string[]

  /** The text shown when no value is selected */
  placeholder?: string

  /** Set to true to allow multiple selected values */
  multiple?: boolean

  /**
   * With `multiple`, the minimum number of values that can be selected.
   * When `multiple` is false or not defined, this is always 1.
   *
   * This only limits the number of values that can be received by the user.
   * This does not limit the number of values that can be displayed by you.
   */
  minValues?: number

  /**
   * With `multiple`, the maximum number of values that can be selected.
   * When `multiple` is false or not defined, this is always 1.
   *
   * This only limits the number of values that can be received by the user.
   * This does not limit the number of values that can be displayed by you.
   */
  maxValues?: number

  /** When true, the select will be slightly faded, and cannot be interacted with. */
  disabled?: boolean

  /**
   * Called when the user inputs a selection.
   * Receives the entire select change event,
   * which can be used to create new replies, etc.
   */
  onChange?: (event: StringSelectMenuInteraction) => void

  /**
   * Convenience shorthand for `onChange`, which receives the first selected value.
   */
  onChangeValue?: (value: string, event: StringSelectMenuInteraction) => void

  /**
   * Convenience shorthand for `onChange`, which receives all selected values.
   */
  onChangeMultiple?: (values: string[], event: StringSelectMenuInteraction) => void
}


/**
 * See [the select menu guide](/guides/select-menu) for a usage example.
 * @category Select
 */
export function Select(props: SelectProps) {
  return (
    <DiscordJSReactElement props={props} createNode={() => new SelectNode(props)}>
      {props.children}
    </DiscordJSReactElement>
  )
}

class SelectNode extends Node<SelectProps> {
  readonly customId = randomUUID()

  override modifyMessageOptions(message: MessageOptions): void {
    const actionRow: ActionRow = []
    message.actionRows.push(actionRow)
    const {
      multiple,
      value,
      values,
      minValues = 0,
      maxValues = 25,
      children,
      onChange,
      onChangeValue,
      onChangeMultiple,
      ...props
    } = this.props

    const options: SelectMenuComponentOptionData[] = [...this.children]
      .filter(
        isOptionNodeTypeguard
      )
      .map((node) => ({
        ...node.options,
        default: value === node.options.value,
      }))



    const item: StringSelectMenuComponentData = {
      ...props,
      type: ComponentType.StringSelect,
      customId: this.customId,
      options,
      disabled: this.isDeferred,
    }

    if (multiple) {
      item.minValues = minValues
      item.maxValues = maxValues
      // if (values) item.values = values
    }

    if (!multiple && value != undefined) {
      // item.values = [value]

    }
    actionRow.push(item)
  }

  override handleComponentInteraction(
    interaction: MessageComponentInteraction,
    onComplete: () => void
  ) {
    const isSelectInteraction =
      interaction.isStringSelectMenu() &&
      interaction.customId === this.customId &&
      !this.props.disabled

    if (!isSelectInteraction) return undefined
    this.interaction = interaction

    this.interaction = interaction
    this.onComplete = onComplete
    const firstValue = interaction.values.at(0)
    Promise.all([
      this.props.onChangeMultiple?.(interaction.values, interaction),
      firstValue ? this.props.onChangeValue?.(firstValue, interaction) : undefined,
      this.props.onChange?.(interaction),
    ]).then(
      () => this.completeInteraction()
    )

    return this
  }
}
