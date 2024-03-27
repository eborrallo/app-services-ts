import { Command } from '../../../../Shared/domain/Command';

export class CreateDocumentCommand extends Command {
  constructor(
    public readonly id: string,
    public readonly template: string,
    public readonly data: object,
  ) {
    super();
  }
}
