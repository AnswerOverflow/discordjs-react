import { ActionRowComponentData, ActionRowData, ComponentType, Events, Message, MessageActionRowComponentData, User } from "discord.js";
import { Renderer } from "./renderer";
import {emitEvent, mockButtonInteraction} from "@answeroverflow/discordjs-mock"
import { ButtonNode } from "./components/button";
import { TestDiscordJSReactMessage } from "./test-message";
export class TestRenderer extends Renderer {
  protected override trackMessage(message: Message<boolean>): void {
    this.message = new TestDiscordJSReactMessage(message, this)
  }
  public findButtonByLabel(label: string) {      
    for(const node of this.nodes){
      if(!(node instanceof ButtonNode))
        continue
      if(node.props.label !== label)
        continue
      return {
          ...node.props,
          click: async ({
            clicker,
            waitForInteractionToComplete = true
          }: {
            clicker: User
            waitForInteractionToComplete?: boolean
          }) => {
            if(!this.message) throw new Error("Message not found")
            const interaction = mockButtonInteraction({
              message: this.message.raw,
              caller: clicker,
              override: {
                custom_id: node.customId,
              }
            })
            await emitEvent(this.discordJSReact.client, Events.InteractionCreate, interaction);
            if(waitForInteractionToComplete){
              // wait until replied is true
              await new Promise(
                resolve => {
                  const interval = setInterval(() => {
                    if(interaction.replied){
                      clearInterval(interval)
                      resolve(undefined)
                    }
                  }, 100)
                }
              )
            }
          }
      }
    }
  }
}
