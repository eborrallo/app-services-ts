import { DomainEvent } from '../../../../Shared/domain/DomainEvent';

type DocumentPendingCreatedDomainEventAttributes = {
  readonly id: string;
  readonly name: string;
  readonly content: string;
};

export class DocumentPendingCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'document.pending.created';

  readonly name: string;
  readonly content: string;

  constructor({
                aggregateId,
                name,
                content,
                eventId,
                occurredOn
              }: {
    aggregateId: string;
    name: string;
    content: string;
    eventId?: string;
    occurredOn?: Date;
  }) {
    super({ eventName: DocumentPendingCreatedDomainEvent.EVENT_NAME, aggregateId, eventId, occurredOn });
    this.name = name;
    this.content = content;
  }

  toPrimitives(): DocumentPendingCreatedDomainEventAttributes {
    const { name,content } = this;
    return {
      id: this.aggregateId,
      content,
      name
    };
  }

  static fromPrimitives(params: {
    aggregateId: string;
    attributes: DocumentPendingCreatedDomainEventAttributes;
    eventId: string;
    occurredOn: Date;
  }): DomainEvent {
    const { aggregateId, attributes, occurredOn, eventId } = params;
    return new DocumentPendingCreatedDomainEvent({
      aggregateId,
      name: attributes.name,
      content: attributes.content,
      eventId,
      occurredOn
    });
  }
}
