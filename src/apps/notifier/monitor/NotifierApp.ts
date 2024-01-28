import { EventBus } from '../../../Contexts/Shared/domain/EventBus';
import container from './dependency-injection';
import { DomainEventSubscribers } from '../../../Contexts/Shared/infrastructure/EventBus/DomainEventSubscribers';
import { RabbitMQConnection } from '../../../Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConnection';
import config from '../../../Contexts/Notifier/Internal/infrastructure/config';

export class NotifierApp {
  async start() {
    await this.configureEventBus();
    const logger = container.get('Shared.Logger');

    logger.info(`  Notifier App is running in ${config.get('env')} mode`);
    logger.info('  Press CTRL-C to stop\n');
    return;
  }

  async stop() {
    const rabbitMQConnection = container.get<RabbitMQConnection>('Notifier.Shared.RabbitMQConnection');
    await rabbitMQConnection.close();
    return;
  }

  private async configureEventBus() {
    const eventBus = container.get<EventBus>('Notifier.Shared.domain.EventBus');
    const rabbitMQConnection = container.get<RabbitMQConnection>('Notifier.Shared.RabbitMQConnection');
    await rabbitMQConnection.connect();

    eventBus.addSubscribers(DomainEventSubscribers.from(container));
  }
}
