import { DomainEvent } from '../../../../Shared/domain/DomainEvent';

type CreateUserDomainEventAttributes = {
  readonly id: string;
  readonly address: string;
};

export class UserCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'user.created';

  readonly address: string;

  constructor({
    aggregateId,
    address,
    eventId,
    occurredOn
  }: {
    aggregateId: string;
    address: string;
    eventId?: string;
    occurredOn?: Date;
  }) {
    super({ eventName: UserCreatedDomainEvent.EVENT_NAME, aggregateId, eventId, occurredOn });
    this.address = address;
  }

  toPrimitives(): CreateUserDomainEventAttributes {
    const { address } = this;
    return {
      id: this.aggregateId,
      address
    };
  }

  static fromPrimitives(params: {
    aggregateId: string;
    attributes: CreateUserDomainEventAttributes;
    eventId: string;
    occurredOn: Date;
  }): DomainEvent {
    const { aggregateId, attributes, occurredOn, eventId } = params;
    return new UserCreatedDomainEvent({
      aggregateId,
      address: attributes.address,
      eventId,
      occurredOn
    });
  }
}
