import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import React from 'react';
import { Embed } from "@answeroverflow/discordjs-react"


function Counter() {
    return (
        <>
            <Embed >
                Hello!
            </Embed>
        </>
    )
}
@ApplyOptions<Command.Options>({
    description: 'Renders an embed button using react',
    name: "embed"
})
export class EmbedCommand extends Command {
    // Register Chat Input and Context Menu command
    public override registerApplicationCommands(registry: Command.Registry) {
        // Register Chat Input command
        registry.registerChatInputCommand({
            name: this.name,
            description: this.description
        });
    }
    // Chat Input (slash) command
    public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        this.container.discordjsJSReact.ephemeralReply(interaction, <Counter />);
    }
}
