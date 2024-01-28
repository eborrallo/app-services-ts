import { Command } from '../../../../../Shared/domain/Command';

export class StoreAuthMessageCommand extends Command {
  constructor(readonly publicAddress: string, readonly message: string) {
    super();
  }
}
