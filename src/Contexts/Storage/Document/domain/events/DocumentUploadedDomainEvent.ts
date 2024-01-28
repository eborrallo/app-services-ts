import { DomainEvent } from '../../../../Shared/domain/DomainEvent';

type DocumentUploadedDomainEventAttributes = {
  readonly id: string;
  readonly metadata: string;
};

export class DocumentUploadedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'document.uploaded';

  readonly metadata: any;

  constructor({
    aggregateId,
    metadata,
    eventId,
    occurredOn
  }: {
    aggregateId: string;
    metadata: any;
    eventId?: string;
    occurredOn?: Date;
  }) {
    super({ eventName: DocumentUploadedDomainEvent.EVENT_NAME, aggregateId, eventId, occurredOn });
    this.metadata = metadata;
  }

  toPrimitives(): DocumentUploadedDomainEventAttributes {
    const { metadata } = this;
    return {
      id: this.aggregateId,
      metadata
    };
  }

  static fromPrimitives(params: {
    aggregateId: string;
    attributes: DocumentUploadedDomainEventAttributes;
    eventId: string;
    occurredOn: Date;
  }): DomainEvent {
    const { aggregateId, attributes, occurredOn, eventId } = params;
    return new DocumentUploadedDomainEvent({
      aggregateId,
      metadata: attributes.metadata,
      eventId,
      occurredOn
    });
  }
}
