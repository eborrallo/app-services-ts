import { DomainEvent } from '../../../../../../src/Contexts/Shared/domain/DomainEvent';
import { DomainEventFailoverPublisher } from '../../../../../../src/Contexts/Shared/infrastructure/EventBus/DomainEventFailoverPublisher/DomainEventFailoverPublisher';
import { DomainEventDeserializerMother } from '../__mother__/DomainEventDeserializerMother';
import { MongoClientMother } from '../__mother__/MongoClientMother';

export class DomainEventFailoverPublisherDouble extends DomainEventFailoverPublisher {
  private publishMock: jest.Mock;
  constructor() {
    super(MongoClientMother.create(), DomainEventDeserializerMother.create());
    this.publishMock = jest.fn();
  }

  async publish(event: DomainEvent): Promise<void> {
    this.publishMock(event);
  }

  assertEventHasBeenPublished(event: DomainEvent) {
    expect(this.publishMock).toHaveBeenCalledWith(event);
  }
}
