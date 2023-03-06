import { Message} from "discord.js";
import { DiscordJSReactMessage } from "./message";
import { Renderer } from "./renderer";
import { TestRenderer } from "./test-renderer";

export class TestDiscordJSReactMessage extends DiscordJSReactMessage {
  constructor(public readonly raw: Message, public readonly renderer: TestRenderer) {    
    super(raw, renderer)
  }
  public findButtonByLabel(label: string) {
    return this.renderer.findButtonByLabel(label)
  }
}