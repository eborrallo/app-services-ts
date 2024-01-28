import { CommandHandler } from '../../../../Shared/domain/CommandHandler';
import { UploadDocumentCommand } from './UploadDocumentCommand';
import { Query } from '../../../../Shared/domain/Query';
import { Storage } from '../../domain/services/Storage';
import { HeadersBuilder } from '../../domain/services/HeadersBuilder';
import { EventBus } from '../../../../Shared/domain/EventBus';
import { DocumentUploadedDomainEvent } from '../../domain/events/DocumentUploadedDomainEvent';

export class UploadDocumentCommandHandler implements CommandHandler<UploadDocumentCommand> {
  constructor(private storage: Storage, private eventBus: EventBus) {}

  subscribedTo(): Query {
    return UploadDocumentCommand;
  }

  async handle(command: UploadDocumentCommand): Promise<void> {
    const headerTypes = HeadersBuilder.requiredHeaderTypes();
    const { [headerTypes.bucket]: bucket } = command.headers;
    const metadata = { ...HeadersBuilder.customXHeaders({ headers: command.headers }) };
    await this.storage.upload(
      {
        id: command.id,
        body: command.body,
        metadata
      },
      bucket
    );
    await this.eventBus.publish([
      new DocumentUploadedDomainEvent({
        aggregateId: command.id,
        metadata
      })
    ]);
  }
}
