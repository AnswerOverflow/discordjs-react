import { Message} from "discord.js";
import { Renderer } from "./renderer";
export class DiscordJSReactMessage {
  constructor(public readonly raw: Message, public readonly renderer: Renderer) {    
  }
}