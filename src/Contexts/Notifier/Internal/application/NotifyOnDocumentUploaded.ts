import { DocumentUploadedDomainEvent } from '../../../Storage/Document/domain/events/DocumentUploadedDomainEvent';
import { DomainEventSubscriber } from '../../../Shared/domain/DomainEventSubscriber';
import Logger from '../../../Shared/domain/Logger';
import { DomainEventClass } from '../../../Shared/domain/DomainEvent';

export class NotifyOnDocumentUploaded implements DomainEventSubscriber<DocumentUploadedDomainEvent> {
  constructor(private logger: Logger) {}

  subscribedTo(): DomainEventClass[] {
    return [DocumentUploadedDomainEvent];
  }

  async on(domainEvent: DocumentUploadedDomainEvent): Promise<void> {
    this.logger.info(`DocumentUploadedDomainEvent: ${JSON.stringify(domainEvent.toPrimitives())}`);
  }
}
