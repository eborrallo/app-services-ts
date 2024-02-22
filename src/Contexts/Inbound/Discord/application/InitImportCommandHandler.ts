import PromisePool from '@supercharge/promise-pool';
import { Command } from '../../../Shared/domain/Command';
import { CommandHandler } from '../../../Shared/domain/CommandHandler';
import { MessageRepository } from '../domain/repositories/MessageRepository';
import { ServerDataFetcher } from '../domain/services/ServerDataFetcher';
import { InitImportCommand } from './InitImportCommand';
import { MessageProcessor } from '../domain/services/MessageProcessor';
import { Guild } from 'discord.js';

export class InitImportCommandHandler implements CommandHandler<InitImportCommand> {
  constructor(private fetcher: ServerDataFetcher, private messageRepository: MessageRepository) {}
  subscribedTo(): Command {
    return InitImportCommand;
  }
  async handle(command: InitImportCommand): Promise<void> {
    const guild = await this.fetcher.guild(command.guildId);
    const channels = await this.fetcher.channels(guild);
    const { errors } = await PromisePool.for(channels)
      .withConcurrency(2)
      .process(async channel => {
        console.log(`Loading channel ${channel.name} #${channel.id}`);
        await this.messages(guild, channel.id);
      });
    if (errors.length > 0) {
      console.log(errors);
    }
    await this.fetcher.close();
  }

  async messages(guild: Guild, channelId: string, beforeMessageId?: string): Promise<any> {
    const limit = 100;
    const messageProcessor = await new MessageProcessor().init();

    const messages = await this.fetcher.messages(guild, channelId, limit, beforeMessageId);
    await Promise.all(
      messages.map(m => {
        const contentProps = messageProcessor.process(m.rawContent);
        m.addContentProps(contentProps);
        this.messageRepository.save(m);
      })
    );
    console.log(`${messages.length} Messages was stored from channel ${channelId}`);

    if (messages.length >= 10) {
      return this.messages(guild, channelId, messages.pop()!.id);
    }
    return;
  }
}
