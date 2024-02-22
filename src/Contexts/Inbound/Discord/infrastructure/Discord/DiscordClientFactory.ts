import { Client, GatewayIntentBits } from 'discord.js';
import config from '../config';

export class DiscordClientFactory {
  static async create(): Promise<Client> {
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
      ]
    });

    await client.login(config.get('discord.token'));
    return client;
  }
}
