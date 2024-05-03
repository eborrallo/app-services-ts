import { AfterAll, BeforeAll, setDefaultTimeout } from '@cucumber/cucumber';
import { EventBus } from '../../../../src/Contexts/Shared/domain/EventBus';
import { StorageApp } from '../../../../src/apps/storage/api/StorageApp';
import container from '../../../../src/apps/storage/api/dependency-injection';
import { EnvironmentArranger } from '../../../Contexts/Shared/infrastructure/arranger/EnvironmentArranger';
import {ConfigureRabbitMQCommand} from "../../../../src/apps/storage/api/command/ConfigureRabbitMQCommand";
import { StartedTestContainer } from 'testcontainers';
import { TestContainersMother } from '../../../../docker/TestContainersMother';
import config from '../../../../src/Contexts/Storage/Document/infrastructure/config';
import {
  MongoConfigFactory
} from '../../../../src/Contexts/Storage/Document/infrastructure/persistence/MongoConfigFactory';
import { S3ConfigFactory } from '../../../../src/Contexts/Storage/Document/infrastructure/storages/S3ConfigFactory';

setDefaultTimeout(60 * 3000);

let application: StorageApp;
let environmentArranger: EnvironmentArranger;
let eventBus: EventBus;
let rabbitMqContainer: StartedTestContainer;
let mongoContainer: StartedTestContainer;
let s3Container: StartedTestContainer;

BeforeAll(async () => {
  const [rabbitMqPromise, mongoPromise, s3Promise] = await Promise.all([
    TestContainersMother.rabbitMQ(config),
    TestContainersMother.mongo(config),
    TestContainersMother.s3(config)
  ]);
  rabbitMqContainer = rabbitMqPromise;
  mongoContainer = mongoPromise;
  s3Container = s3Promise;
  await ConfigureRabbitMQCommand.run(config.get('rabbitmq'));
  container.register('Storage.Shared.MongoConfig', MongoConfigFactory).addArgument(config.get('mongo.url')).setFactory(MongoConfigFactory, 'createConfig');
  container.register('S3Config', S3ConfigFactory).addArgument(config.get('s3')).setFactory(S3ConfigFactory, 'create');

  environmentArranger = await container.get<Promise<EnvironmentArranger>>('Storage.EnvironmentArranger');
  eventBus = container.get<EventBus>('Storage.Shared.domain.EventBus');
  await environmentArranger.arrange();

  application = new StorageApp();
  await application.start();
});

AfterAll(async () => {
  await environmentArranger.arrange();
  await environmentArranger.close();

  await application.stop();
  await rabbitMqContainer.stop();
  await mongoContainer.stop();
  await s3Container.stop();

});

export { application, environmentArranger, eventBus };
