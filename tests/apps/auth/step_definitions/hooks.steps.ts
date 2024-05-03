import { AfterAll, BeforeAll, setDefaultTimeout } from '@cucumber/cucumber';
import { EnvironmentArranger } from '../../../Contexts/Shared/infrastructure/arranger/EnvironmentArranger';
import { EventBus } from '../../../../src/Contexts/Shared/domain/EventBus';
import { ConfigureRabbitMQCommand } from '../../../../src/apps/auth/rest/command/ConfigureRabbitMQCommand';
import container from '../../../../src/apps/auth/rest/dependency-injection';
import { AuthApp } from '../../../../src/apps/auth/rest/AuthApp';
import { TestContainersMother } from '../../../../docker/TestContainersMother';
import { StartedTestContainer } from 'testcontainers';
import config from '../../../../src/Contexts/Auth/User/infrastructure/config';
import { LocalBlockchain } from '../../../../src/Contexts/Auth/User/infrastructure/apis/LocalBlockchain';
import {
  TypeOrmConfigFactory
} from '../../../../src/Contexts/Auth/User/infrastructure/persistence/TypeOrmConfigFactory';


let application: AuthApp;
let environmentArranger: EnvironmentArranger;
let eventBus: EventBus;
setDefaultTimeout(60 * 1000);
let blockchainContainer: StartedTestContainer;
let rabbitMqContainer: StartedTestContainer;
let postgresContainer: StartedTestContainer;
BeforeAll(async () => {
  const [rabbitMqPromise, blockchainPromise,postgresPromise] = await Promise.all([
    TestContainersMother.rabbitMQ(config),
    TestContainersMother.blockchain(),
    TestContainersMother.postgres(config)
  ]);
  rabbitMqContainer = rabbitMqPromise;
  blockchainContainer = blockchainPromise;
  postgresContainer = postgresPromise;
  await ConfigureRabbitMQCommand.run(config.get('rabbitmq'));

  container.register('EthersProvider', LocalBlockchain).addArgument(blockchainContainer.getMappedPort(8545)).setFactory(LocalBlockchain, 'get');
  container.register('Auth.Shared.TypeOrmConfig', TypeOrmConfigFactory).addArgument(config.get('typeorm')).setFactory(TypeOrmConfigFactory, 'createConfig');

  environmentArranger = await container.get<Promise<EnvironmentArranger>>('Auth.EnvironmentArranger');
  eventBus = container.get<EventBus>('Auth.Shared.domain.EventBus');
  await environmentArranger.arrange();

  application = new AuthApp();
  await application.start();
});

AfterAll(async () => {
  await environmentArranger.arrange();
  await environmentArranger.close();

  await application.stop();
  await rabbitMqContainer.stop();
  await blockchainContainer.stop();
  await postgresContainer.stop();
});

export { application, environmentArranger, eventBus };
