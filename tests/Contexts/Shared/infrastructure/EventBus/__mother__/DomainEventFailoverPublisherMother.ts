import { DomainEventFailoverPublisher } from '../../../../../../src/Contexts/Shared/infrastructure/EventBus/DomainEventFailoverPublisher/DomainEventFailoverPublisher';
import { DomainEventFailoverPublisherDouble } from '../__mocks__/DomainEventFailoverPublisherDouble';
import { DomainEventDeserializerMother } from './DomainEventDeserializerMother';
import { MongoClientMother } from './MongoClientMother';

export class DomainEventFailoverPublisherMother {
  static create() {
    const mongoClient = MongoClientMother.create();
    return new DomainEventFailoverPublisher(mongoClient, DomainEventDeserializerMother.create());
  }

  static failOverDouble() {
    return new DomainEventFailoverPublisherDouble();
  }
}
