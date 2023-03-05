import React from "react"
import { MessageOptions, Renderer, RendererableInteractions } from "./renderer"



export class InteractionReplyRenderer extends Renderer {
  constructor(initalContent: React.ReactNode, public interaction: RendererableInteractions) {
    super(initalContent, interaction)
  }

  protected override async createMessage(options: MessageOptions) {    
    console.log("createMessage", options)
    if(this.interaction.replied){
      return this.interaction.followUp({
        ...options,
        ephemeral: true
      })
    }    
    return this.interaction.reply(
      {
        ...options,
        ephemeral: true,
        fetchReply: true,
      }
    )
  }
}
