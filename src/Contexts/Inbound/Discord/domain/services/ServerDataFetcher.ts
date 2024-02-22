import { ChannelType, Client, GuildChannel, TextChannel, Guild, MessageType } from 'discord.js';
import { MessageBuilder } from './MessageBuilder';
import { Message } from '../models/Message';
import { exit } from 'process';

export class ServerDataFetcher {
  constructor(private client: Promise<Client>) {}

  async guild(guildId: string): Promise<Guild> {
    return (await this.client).guilds.fetch(guildId);
  }
  async channels(guild: Guild): Promise<GuildChannel[]> {
    const me = await guild.members.fetchMe();
    const channels = await guild.channels.fetch();
    const allowedChannels = channels.map(_ => _).filter(_ => _?.permissionsFor(me) && _.type === ChannelType.GuildText);
    const result = [];

    //TODO Impove it with a Promise pool ,tke in account RateLimit 16 by second (1000 by 10 min)
    for (const index in allowedChannels) {
      result.push(await allowedChannels[index]!.fetch());
    }
    return result;
  }

  async messages(guild: Guild, channelId: string, limit: number, beforeMessageId?: string): Promise<Message[]> {
    //TODO Impove it with a channels.cache
    try {
      const c = (await (await this.client).channels.fetch(channelId)) as TextChannel;
      const response = await c.messages!.fetch({ limit, before: beforeMessageId });

      const arrayMessages = response.map(_ => _);
      const result: Message[] = [];

      console.log(`Fetched ${arrayMessages.length} messages `);
      for (const i in arrayMessages) {
        const m = arrayMessages[i];
        if (m.type == MessageType.Default || m.type == MessageType.Reply) {
          result.push(MessageBuilder.build(guild, m));
        }
      }
      return result;
    } catch (e) {
      console.error(`On Fetching messages from Guid ${guild.name} channel ${channelId}`);
      console.log(e);
      exit(1);
    }
  }

  async close() {
    await (await this.client).destroy();
  }
}
