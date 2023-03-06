import { Client } from "discord.js";
import { ReactNode } from "react";
import { DiscordJSReact, ReacordConfig } from "./discordjs-react";
import { RendererOptions, Renderer } from "./renderer";
import { TestRenderer } from "./test-renderer";


export class TestDiscordJSReact extends DiscordJSReact {
    constructor(public readonly client: Client, public readonly config: ReacordConfig = {}) {
        super(client, config)
    }
    public override createRenderer(renderer: RendererOptions, initialContent?: ReactNode) {
        return new TestRenderer(renderer, this.client, initialContent)
    }
}