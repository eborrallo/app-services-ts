import {
  DomainEventFailoverPublisher
} from '../../../../../src/Contexts/Shared/infrastructure/EventBus/DomainEventFailoverPublisher/DomainEventFailoverPublisher';
import { MongoEnvironmentArranger } from '../mongo/MongoEnvironmentArranger';
import { DomainEventDeserializerMother } from './__mother__/DomainEventDeserializerMother';
import { DomainEventDummyMother } from './__mocks__/DomainEventDummy';
import { MongoDBContainer } from '@testcontainers/mongodb';
import { MongoClientMother } from './__mother__/MongoClientMother';

describe('DomainEventFailoverPublisher test', () => {
  let arranger: MongoEnvironmentArranger;
  const deserializer = DomainEventDeserializerMother.create();
  const mongoContainer = new MongoDBContainer().start();
  const connectionMongo = MongoClientMother.createFromContainer(mongoContainer, 'failover');

  beforeAll(async () => {
    arranger = new MongoEnvironmentArranger(connectionMongo);
  });
  afterAll(async () => {
    await arranger.close();
    await (await mongoContainer).stop();
  });
  beforeEach(async () => {
    await arranger.arrange();
  });

  it('should save the published events', async () => {
    const eventBus = new DomainEventFailoverPublisher(connectionMongo, deserializer);
    const event = DomainEventDummyMother.random();

    await eventBus.publish(event);

    expect(await eventBus.consume()).toEqual([event]);
  });
});
