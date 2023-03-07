import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import React, { useState, useEffect } from 'react';

export const useCounter = () => {
    const [counter, setCounter] = useState(0);
    // update once a second
    useEffect(() => {
        const interval = setInterval(() => {
            setCounter(counter + 1);
        }, 1000);
        return () => clearInterval(interval);
    });
    return counter;
}

const CounterRenderer = () => {
    const counter = useCounter();


    return (<React.Fragment>
        {counter}

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
        this.container.discordjsJSReact.ephemeralReply(interaction, <CounterRenderer />);
    }
}
