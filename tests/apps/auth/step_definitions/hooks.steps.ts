import { AfterAll, BeforeAll, setDefaultTimeout } from '@cucumber/cucumber';
import { EnvironmentArranger } from '../../../Contexts/Shared/infrastructure/arranger/EnvironmentArranger';
import { EventBus } from '../../../../src/Contexts/Shared/domain/EventBus';
import { ConfigureRabbitMQCommand } from '../../../../src/apps/auth/rest/command/ConfigureRabbitMQCommand';
import container from '../../../../src/apps/auth/rest/dependency-injection';
import { AuthApp } from '../../../../src/apps/auth/rest/AuthApp';

let application: AuthApp;
let environmentArranger: EnvironmentArranger;
let eventBus: EventBus;
//let blockchainContainer: StartedTestContainer;
setDefaultTimeout(60 * 1000);
/*
const genericContainer = GenericContainer
  .fromDockerfile(__dirname + '/../../../../docker/anvil')
  .withBuildArgs({ ACCOUNT_PASSWORD: 'PASSWORD' })
  .build();
*/
BeforeAll(async () => {
  await ConfigureRabbitMQCommand.run();

  /*blockchainContainer = await (await genericContainer)
    .withExposedPorts(8545)
    .withWaitStrategy(Wait.forLogMessage('Listening on 127.0.0.1:8545'))
    .withStartupTimeout(20_000)
    .start();

  container.register('EthersProvider', LocalBlockchain)
    .addArgument(blockchainContainer.getMappedPort(8545))
    .setFactory(LocalBlockchain, 'get');
*/
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
  // await blockchainContainer.stop();
});

export { application, environmentArranger, eventBus };
