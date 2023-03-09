/*
    Handles all renderers
*/

import { Client, Events, MessageComponentInteraction, RepliableInteraction } from "discord.js";
import React, { ReactNode } from "react";
import { DiscordJSReactMessage } from "./message";
import { Renderer, RendererableInteractions, RendererOptions } from "./renderer";

export type RendererWrapper = React.FC<{ children: ReactNode }>

export type ReacordConfig = {
    /**
     * The max number of active instances.
     * When this limit is exceeded, the oldest instances will be disabled.
     */
    maxInstances?: number
    wrapper: RendererWrapper
}

export class DiscordJSReact {
    // Maps the interaction id to the renderer
    protected renderers: Renderer[] = [];
    constructor(public readonly client: Client, public readonly config: ReacordConfig & {
        wrapper?: RendererWrapper
    } = {
            wrapper: (props) => <>{props.children}</>
        }) {
        client.on(Events.InteractionCreate, (interaction) => {
            if (!(interaction.isMessageComponent())) return
            for (const renderer of this.renderers) {
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
    public createRenderer(renderer: RendererOptions, initialContent?: ReactNode) {
        return new Renderer(renderer, this.client, initialContent, this.config.wrapper)
    }

    public activateRenderer(renderer: Renderer) {
        if (this.renderers.length >= this.maxInstances) {
            this.deactivate(this.renderers[0]!)
        }
        this.renderers.push(renderer)
        return renderer
    }


    public ephemeralReply(interaction: RendererableInteractions, initialContent: ReactNode) {
        return this.activateRenderer(
            this.createRenderer(
                {
                    type: "interaction",
                    interaction,
                    ephemeral: true,
                },
                initialContent
            )
        )
    }

    public getMessage(index: number = 0) {
        return this.renderers.at(index)?.message
    }
}