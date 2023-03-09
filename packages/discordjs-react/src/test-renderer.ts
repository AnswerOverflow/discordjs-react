import { ActionRowComponentData, ActionRowData, ComponentType, Events, Message, MessageActionRowComponentData, User } from "discord.js";
import { Renderer } from "./renderer";
import {emitEvent, mockButtonInteraction, mockStringSelectInteraction} from "@answeroverflow/discordjs-mock"
import { ButtonNode } from "./components/button";
import { TestDiscordJSReactMessage } from "./test-message";
import { LinkNode } from "./components/link";
import { SelectNode } from "./components/select";
import { MessageOptions } from "./message";
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
          ...node.getActionRowItemData(),
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
  public findLinkByLabel(label: string) {
    for(const node of this.nodes){
      if(!(node instanceof LinkNode))
        continue
      if(node.props.label !== label)
        continue
      return node.getActionRowItemData()        
    }
  }
  public findSelectByPlaceholder(placeholder: string) {
    for(const node of this.nodes){
      if(!(node instanceof SelectNode)){
        continue
      }
      if(node.props.placeholder !== placeholder){
        continue
      }
      return {
        ...node.getActionRowItemData(),
        select: async ({
          clicker,
          waitForInteractionToComplete = true,
          values
        }: {
          clicker: User
          waitForInteractionToComplete?: boolean
          values: string[] | string
        }) => {
          if(!this.message) throw new Error("Message not found")
          const interaction = mockStringSelectInteraction({
            message: this.message.raw,
            caller: clicker,
            data: {
              custom_id: node.customId,
              values
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
