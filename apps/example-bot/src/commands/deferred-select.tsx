import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import React from 'react';
import { Select, Option } from "@answeroverflow/discordjs-react"


function SelectMenu() {
  const [value, setValue] = React.useState<string | undefined>(undefined)
  return (
    <>
      <Select placeholder='hello' value={value} onChangeValue={async (val) => {
        // wait 7 seconds
        await new Promise(resolve => setTimeout(resolve, 7000));
        setValue(val)
      }}>
        <Option label="Option 1" value="1" />
        <Option label="Option 2" value="2" />
      </Select>
    </>
  )
}
@ApplyOptions<Command.Options>({
  description: 'Renders a deferred select menu using react',
  name: "deferred-select"
})
export class SelectCommand extends Command {
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
    this.container.discordjsJSReact.ephemeralReply(interaction, <>
      <SelectMenu />
      <SelectMenu />
      <SelectMenu />
      <SelectMenu />
      <SelectMenu />
    </>);
  }
}
