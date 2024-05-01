import { DomainEvent } from '../../../../../src/Contexts/Shared/domain/DomainEvent';
import {
  DomainEventDeserializer
} from '../../../../../src/Contexts/Shared/infrastructure/EventBus/DomainEventDeserializer';
import {
  DomainEventFailoverPublisher
} from '../../../../../src/Contexts/Shared/infrastructure/EventBus/DomainEventFailoverPublisher/DomainEventFailoverPublisher';
import {
  DomainEventSubscribers
} from '../../../../../src/Contexts/Shared/infrastructure/EventBus/DomainEventSubscribers';
import {
  RabbitMQConfigurer
} from '../../../../../src/Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConfigurer';
import {
  RabbitMQConnection
} from '../../../../../src/Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConnection';
import { RabbitMQConsumer } from '../../../../../src/Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConsumer';
import { RabbitMQEventBus } from '../../../../../src/Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQEventBus';
import {
  RabbitMQQueueFormatter
} from '../../../../../src/Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQQueueFormatter';
import { MongoEnvironmentArranger } from '../mongo/MongoEnvironmentArranger';
import { DomainEventDummyMother } from './__mocks__/DomainEventDummy';
import { DomainEventSubscriberDummy } from './__mocks__/DomainEventSubscriberDummy';
import { DomainEventFailoverPublisherMother } from './__mother__/DomainEventFailoverPublisherMother';
import { RabbitMQConnectionMother } from './__mother__/RabbitMQConnectionMother';
import { UserCreatedDomainEvent } from '../../../../../src/Contexts/Auth/User/domain/events/UserCreatedDomainEvent';
import { MongoClientMother } from './__mother__/MongoClientMother';
import { MongoDBContainer } from '@testcontainers/mongodb';
import { GenericContainer, Wait } from 'testcontainers';


describe('RabbitMQEventBus test', () => {
  const exchange = 'test_domain_events';
  let arranger: MongoEnvironmentArranger;
  const queueNameFormatter = new RabbitMQQueueFormatter('test');
  const mongoContainer = new MongoDBContainer().start();
  const connectionMongo = MongoClientMother.createFromContainer(mongoContainer, 'rabbit');


  beforeAll(async () => {
    //await mongoContainer;
    arranger = new MongoEnvironmentArranger(connectionMongo);
  });

  beforeEach(async () => {
    await arranger.arrange();
  });

  afterAll(async () => {
    await arranger.close();
    await (await mongoContainer).stop();
  });

  describe('unit', () => {
    it('should use the failover publisher if publish to RabbitMQ fails', async () => {
      const connection = RabbitMQConnectionMother.failOnPublish();
      const failoverPublisher = DomainEventFailoverPublisherMother.failOverDouble(connectionMongo);
      const eventBus = new RabbitMQEventBus({
        failoverPublisher,
        connection,
        exchange,
        queueNameFormatter,
        maxRetries: 3
      });
      const event = new UserCreatedDomainEvent({
        aggregateId: '123',
        eventId: '123',
        occurredOn: new Date(),
        address: 'test'
      });

      await eventBus.publish([event]);

      failoverPublisher.assertEventHasBeenPublished(event);
    });
  });

  describe('integration', () => {
    let connection: RabbitMQConnection;
    let dummySubscriber: DomainEventSubscriberDummy;
    let configurer: RabbitMQConfigurer;
    let failoverPublisher: DomainEventFailoverPublisher;
    let subscribers: DomainEventSubscribers;
    const rabbitContainer = new GenericContainer('rabbitmq:3.8')
      .withExposedPorts(5672)
      .withWaitStrategy(Wait.forLogMessage('Server startup complete'))
      .withStartupTimeout(60_000)
      .start();

    beforeEach(async () => {
      connection = await RabbitMQConnectionMother.createFromContainer(rabbitContainer);
      failoverPublisher = DomainEventFailoverPublisherMother.create(connectionMongo);
      configurer = new RabbitMQConfigurer(connection, queueNameFormatter, 50);
      await arranger.arrange();
      dummySubscriber = new DomainEventSubscriberDummy();
      subscribers = new DomainEventSubscribers([dummySubscriber]);
    });

    afterAll(async () => {
      await (await rabbitContainer).stop();
    })

    afterEach(async () => {
      await cleanEnvironment();
      await connection.close();
    });

    it('should consume the events published to RabbitMQ', async () => {
      await configurer.configure({ exchange, subscribers: [dummySubscriber] });
      const eventBus = new RabbitMQEventBus({
        failoverPublisher,
        connection,
        exchange,
        queueNameFormatter,
        maxRetries: 3
      });
      await eventBus.addSubscribers(subscribers);
      const event = DomainEventDummyMother.random();

      await eventBus.publish([event]);

      await dummySubscriber.assertConsumedEvents([event]);
    });

    it('should retry failed domain events', async () => {
      dummySubscriber = DomainEventSubscriberDummy.failsFirstTime();
      subscribers = new DomainEventSubscribers([dummySubscriber]);
      await configurer.configure({ exchange, subscribers: [dummySubscriber] });
      const eventBus = new RabbitMQEventBus({
        failoverPublisher,
        connection,
        exchange,
        queueNameFormatter,
        maxRetries: 3
      });
      await eventBus.addSubscribers(subscribers);
      const event = DomainEventDummyMother.random();

      await eventBus.publish([event]);

      await dummySubscriber.assertConsumedEvents([event]);
    });

    it('it should send events to dead letter after retry failed', async () => {
      dummySubscriber = DomainEventSubscriberDummy.alwaysFails();
      subscribers = new DomainEventSubscribers([dummySubscriber]);
      await configurer.configure({ exchange, subscribers: [dummySubscriber] });
      const eventBus = new RabbitMQEventBus({
        failoverPublisher,
        connection,
        exchange,
        queueNameFormatter,
        maxRetries: 3
      });
      await eventBus.addSubscribers(subscribers);
      const event = DomainEventDummyMother.random();

      await eventBus.publish([event]);

      await dummySubscriber.assertConsumedEvents([]);
      assertDeadLetter([event]);
    });

    async function cleanEnvironment() {
      await connection.deleteQueue(queueNameFormatter.format(dummySubscriber));
      await connection.deleteQueue(queueNameFormatter.formatRetry(dummySubscriber));
      await connection.deleteQueue(queueNameFormatter.formatDeadLetter(dummySubscriber));
    }

    async function assertDeadLetter(events: Array<DomainEvent>) {
      const deadLetterQueue = queueNameFormatter.formatDeadLetter(dummySubscriber);
      const deadLetterSubscriber = new DomainEventSubscriberDummy();
      const deadLetterSubscribers = new DomainEventSubscribers([dummySubscriber]);
      const deserializer = DomainEventDeserializer.configure(deadLetterSubscribers);
      const consumer = new RabbitMQConsumer({
        subscriber: deadLetterSubscriber,
        deserializer,
        connection,
        maxRetries: 3,
        queueName: deadLetterQueue,
        exchange
      });
      await connection.consume(deadLetterQueue, consumer.onMessage.bind(consumer));

      await deadLetterSubscriber.assertConsumedEvents(events);
    }
  });
});
