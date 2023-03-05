import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import React from 'react';
import { Embed, EmbedAuthor, EmbedField, EmbedFooter, EmbedTitle, EmbedThumbnail, EmbedImage } from "@answeroverflow/discordjs-react"


function Counter() {
    return (
        <>
            <Embed >
                <EmbedTitle>Embed Title</EmbedTitle>
                <EmbedAuthor name="Embed Author" />
                <EmbedField name="Embed Field" value="Embed Field Value" inline={true} />
                <EmbedField name="Embed Field" value="✅" inline={true} />
                Hello!
                <EmbedFooter text="Embed Footer" />
                <EmbedThumbnail url="https://i.imgur.com/wSTFkRM.png" />
                <EmbedImage url="https://i.imgur.com/wSTFkRM.png" />

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
