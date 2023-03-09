import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import React from 'react';
import { useCustomInstanceData } from '../lib/context';



function Consumer() {
  const value = useCustomInstanceData();
  console.log(value)
  console.log(value)
  console.log(value)
  console.log(value)
  return <>
    {value.foo}
  </>
}


@ApplyOptions<Command.Options>({
  description: 'Renders a value using react context',
  name: "context"
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

    this.container.discordjsJSReact.ephemeralReply(interaction,
      <Consumer />)
  }
}