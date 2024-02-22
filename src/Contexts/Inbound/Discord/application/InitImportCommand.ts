import { Command } from '../../../Shared/domain/Command';

export class InitImportCommand extends Command {
  constructor(readonly guildId: string) {
    super();
  }
}
