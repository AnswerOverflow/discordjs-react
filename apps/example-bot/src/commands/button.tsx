import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import React, { useState, useEffect } from 'react';



const TextRenderer = () => {
    const [text, setText] = useState("Hello World!");
    // update the text once a second to something random
    useEffect(() => {
        const interval = setInterval(() => {
            setText(Math.random().toString(36).substring(7));
        }, 1000);
        return () => clearInterval(interval);
    });
    return (<React.Fragment>
        {text}

    </React.Fragment>)

}
@ApplyOptions<Command.Options>({
    description: 'Renders text using react',
    name: "text"
})
export class TextCommand extends Command {
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
        this.container.discordjsJSReact.ephemeralReply(interaction, <TextRenderer />);
    }
}
