import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import React from 'react';
import { Link } from "@answeroverflow/discordjs-react"


function LinkMenu() {
    const [count, setCount] = React.useState(0)
    return (
        <>
            this button was clicked {count} times
            <Link
                label="+1"
                url='https://google.com'
                emoji='👍'
            />
            <Link
                label="Success Button"
                url='https://google.com'
                emoji='👍'
            />
            <Link
                label="Danger Button"
                url='https://google.com'
                emoji='👍'
            />
        </>
    )
}
@ApplyOptions<Command.Options>({
    description: 'Renders a link using react',
    name: "link"
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
        this.container.discordjsJSReact.ephemeralReply(interaction, <LinkMenu />);
    }
}
