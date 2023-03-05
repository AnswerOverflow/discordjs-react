import type { DiscordJSReact } from "@answeroverflow/discordjs-react";

declare module "@sapphire/pieces" {
	interface Container {
		discordjsJSReact: DiscordJSReact;
	}
}
