/*
    Handles all renderers
*/

import { Client, Events, MessageComponentInteraction, RepliableInteraction } from "discord.js";
import React, { ReactNode } from "react";
import { InteractionReplyRenderer } from "./interaction-reply-renderer";
import { Renderer, RendererableInteractions } from "./renderer";

export const repliedInteractionIds = new Set<string>()
export type ReacordConfig = {
    /**
     * The max number of active instances.
     * When this limit is exceeded, the oldest instances will be disabled.
     */
    maxInstances?: number
  }

export class DiscordJSReact {
    // Maps the interaction id to the renderer
    protected renderers: Renderer[] = [];
    constructor(public readonly client: Client, public readonly config: ReacordConfig = {}) {
        client.on(Events.InteractionCreate, (interaction) => {
            if(!(interaction instanceof MessageComponentInteraction)) return
            for(const renderer of this.renderers){
                renderer.handleComponentInteraction(interaction);
            }
        })
    }
    private deactivate(renderer: Renderer) {
        this.renderers = this.renderers.filter((it) => it !== renderer)
        renderer.deactivate()
      }
      private get maxInstances() {
        return this.config.maxInstances ?? 50
      }
    public createRenderer(renderer: Renderer, initialContent?: ReactNode) {
        if(this.renderers.length >= this.maxInstances){
            this.deactivate(this.renderers[0]!)
        }
        this.renderers.push(renderer)
        if(initialContent){
            renderer.render()
        }
    }

    public ephemeralReply(interaction: RendererableInteractions, initialContent: ReactNode) {
        this.createRenderer(new InteractionReplyRenderer(initialContent, interaction))
    }
}