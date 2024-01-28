import { Command } from '../../../../../Shared/domain/Command';

export class VerifyMessageCommand extends Command {
  constructor(readonly publicAddress: string, readonly signature: string) {
    super();
  }
}
