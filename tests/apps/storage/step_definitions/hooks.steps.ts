import { AfterAll, BeforeAll } from '@cucumber/cucumber';
import { EventBus } from '../../../../src/Contexts/Shared/domain/EventBus';
import { StorageApp } from '../../../../src/apps/storage/api/StorageApp';
import container from '../../../../src/apps/storage/api/dependency-injection';
import { EnvironmentArranger } from '../../../Contexts/Shared/infrastructure/arranger/EnvironmentArranger';
import {ConfigureRabbitMQCommand} from "../../../../src/apps/storage/api/command/ConfigureRabbitMQCommand";
let application: StorageApp;
let environmentArranger: EnvironmentArranger;
let eventBus: EventBus;

BeforeAll(async () => {
  await ConfigureRabbitMQCommand.run();

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
});

export { application, environmentArranger, eventBus };
