import {
  DomainEventFailoverPublisher
} from '../../../../../../src/Contexts/Shared/infrastructure/EventBus/DomainEventFailoverPublisher/DomainEventFailoverPublisher';
import { DomainEventFailoverPublisherDouble } from '../__mocks__/DomainEventFailoverPublisherDouble';
import { DomainEventDeserializerMother } from './DomainEventDeserializerMother';
import { MongoClient } from 'mongodb';

export class DomainEventFailoverPublisherMother {
  static create(mongoClient: Promise<MongoClient>) {
    return new DomainEventFailoverPublisher(mongoClient, DomainEventDeserializerMother.create());
  }

  static failOverDouble(mongoClient: Promise<MongoClient>) {
    return new DomainEventFailoverPublisherDouble(mongoClient);
  }
}
