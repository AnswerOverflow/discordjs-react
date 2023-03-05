import { ActionRowComponentData, ActionRowData, MessageActionRowComponentData } from "discord.js";
import { Renderer } from "./renderer";

export class TestRenderer extends Renderer {
  public findButtonByLabel(label: string) {
    const items: ActionRowData<MessageActionRowComponentData>[] = this.getMessageOptions().components ?? []
    for(const row of items){
      
    }
  }
}
