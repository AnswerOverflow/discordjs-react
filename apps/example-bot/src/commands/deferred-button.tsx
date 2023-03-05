import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import React from 'react';
import { Button } from "@answeroverflow/discordjs-react"


function Counter() {
    const [count, setCount] = React.useState(0)
    return (
        <>
            this button was clicked {count} times
            <Button
                label="+1"
                style="Success"
                onClick={async () => {
                    // wait for 7 seconds
                    await new Promise(resolve => setTimeout(resolve, 7000));
                    setCount(count + 1)
                }}
            />
            <Button
                label="Success Button"
                style="Success"
                onClick={async () => {
                    // wait for 7 seconds
                    await new Promise(resolve => setTimeout(resolve, 7000));
                    setCount(count + 1)
                }}
            />
            <Button

                label="Danger Button"
                style="Danger"
                onClick={async () => {
                    // wait for 7 seconds
                    await new Promise(resolve => setTimeout(resolve, 7000));
                    setCount(count + 1)
                }}

            />

        </>
    )
}
@ApplyOptions<Command.Options>({
    description: 'Renders a deferred button using react',
    name: "deferred-button"
})
export class DeferredButton extends Command {
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
