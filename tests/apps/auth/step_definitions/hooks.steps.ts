import { AfterAll, BeforeAll } from '@cucumber/cucumber';
import { EnvironmentArranger } from '../../../Contexts/Shared/infrastructure/arranger/EnvironmentArranger';
import { EventBus } from '../../../../src/Contexts/Shared/domain/EventBus';
import {ConfigureRabbitMQCommand} from "../../../../src/apps/auth/rest/command/ConfigureRabbitMQCommand";
import container from "../../../../src/apps/auth/rest/dependency-injection";
import {AuthApp} from "../../../../src/apps/auth/rest/AuthApp";

let application: AuthApp;
let environmentArranger: EnvironmentArranger;
let eventBus: EventBus;

BeforeAll(async () => {
  await ConfigureRabbitMQCommand.run();

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
});

export { application, environmentArranger, eventBus };
