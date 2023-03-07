import './lib/setup';
import { container, LogLevel, SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord.js';
import { DiscordJSReact } from '@answeroverflow/discordjs-react';

declare module "@sapphire/pieces" {
	interface Container {
		discordjsJSReact: DiscordJSReact;
	}
}

const client = new SapphireClient({
	defaultPrefix: '!',
	caseInsensitiveCommands: true,
	logger: {
		level: LogLevel.None
	},
	intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
	loadMessageCommandListeners: true,
	hmr: {

	}
});

const main = async () => {
	try {
		client.logger.info('Logging in');
		container.discordjsJSReact = new DiscordJSReact(client)
		await client.login();
		client.logger.info('logged in');
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

main();
