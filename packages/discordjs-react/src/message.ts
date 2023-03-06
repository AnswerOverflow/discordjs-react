import { ActionRowComponentOptions, ButtonStyle, Message } from "discord.js";
import { Except } from "type-fest";
import { EmbedOptions } from "./components/embeds/embed-options";
import { SelectProps } from "./components/select";
import { Renderer } from "./renderer";

export type MessageOptions = {
  content: string;
  embeds: EmbedOptions[];
  actionRows: ActionRow[];
};

export type ActionRow = ActionRowItem[];
export type ActionRowItem = ActionRowComponentOptions;
export type MessageButtonOptions = {
  type: "button";
  customId: string;
  label?: string;
  style?: keyof typeof ButtonStyle;
  disabled?: boolean;
  emoji?: string;
};

export type MessageLinkOptions = {
  type: "link";
  url: string;
  label?: string;
  emoji?: string;
  disabled?: boolean;
};

export type MessageSelectOptions = Except<SelectProps, "children" | "value"> & {
  type: "select";
  customId: string;
  options: MessageSelectOptionOptions[];
};

export type MessageSelectOptionOptions = {
  label: string;
  value: string;
  description?: string;
  emoji?: string;
};


export class DiscordJSReactMessage {
  constructor(public readonly raw: Message, public readonly renderer: Renderer) {}

}