import { DomainEventSubscriber } from '../../../Shared/domain/DomainEventSubscriber';
import Logger from '../../../Shared/domain/Logger';
import { DomainEventClass } from '../../../Shared/domain/DomainEvent';
import { DocumentPendingCreatedDomainEvent } from '../domain/events/DocumentPendingCreatedDomainEvent';
import { PdfGenerator } from '../domain/services/PdfGenerator';

export class GeneratePdfOnDocumentCreated implements DomainEventSubscriber<DocumentPendingCreatedDomainEvent> {
  constructor(private pdfGenerator: PdfGenerator, private logger: Logger) {
  }

  subscribedTo(): DomainEventClass[] {
    return [DocumentPendingCreatedDomainEvent];
  }

  async on(domainEvent: DocumentPendingCreatedDomainEvent): Promise<void> {

    try {

      this.logger.info(`DocumentPendingCreatedDomainEvent: ${JSON.stringify(domainEvent.toPrimitives())}`);
      // TODO render the html
      const payload = {
        header: '',
        body: '',
        footer: '',
        options: ''
      };
      const path = './logs/';
      const filename = 'test.pdf';
      await this.pdfGenerator.generate(path, filename, payload.header, payload.body, payload.footer, payload.options, domainEvent.aggregateId, domainEvent.eventId);
      // TODO upload to S3
    } catch (e: any) {
      this.logger.error(e.message);
      throw e;
    }
  }
}
