import { Command } from '../../../../Shared/domain/Command';

export class UploadDocumentCommand extends Command {
  constructor(readonly id: string, readonly body: string, readonly headers: any) {
    super();
  }
}
