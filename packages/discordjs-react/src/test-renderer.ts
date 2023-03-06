import { ActionRowComponentData, ActionRowData, ComponentType, MessageActionRowComponentData } from "discord.js";
import { Renderer } from "./renderer";

export class TestRenderer extends Renderer {
  public findButtonByLabel(label: string) {
    const items = this.getMessageOptions().components ?? []
    for(const row of items){
      if(row.type !== ComponentType.ActionRow)
        continue
      for(const component of row.components){
        if(component.type !== ComponentType.Button)
          continue
        if(component.label === label)
          return {
            ...component,
            click: async () => {
              
            }
          }
        }              
      }          
  }
}
