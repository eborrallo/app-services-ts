import { DomainEventSubscribers } from '../../../../Contexts/Shared/infrastructure/EventBus/DomainEventSubscribers';
import { RabbitMQConfigurer } from '../../../../Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConfigurer';
import { RabbitMQConnection } from '../../../../Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConnection';
import { RabbitMQQueueFormatter } from '../../../../Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQQueueFormatter';
import container from '../dependency-injection';
import { RabbitMQConfig } from '../../../../Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConfig';

export class ConfigureRabbitMQCommand {
  static async run() {
    const connection = container.get<RabbitMQConnection>('Storage.Shared.RabbitMQConnection');
    const nameFormatter = container.get<RabbitMQQueueFormatter>('Storage.Shared.RabbitMQQueueFormatter');
    const { exchangeSettings, retryTtl } = container.get<RabbitMQConfig>('Storage.Shared.RabbitMQConfig');

    await connection.connect();

    const configurer = new RabbitMQConfigurer(connection, nameFormatter, retryTtl);
    const subscribers = DomainEventSubscribers.from(container).items;

    await configurer.configure({ exchange: exchangeSettings.name, subscribers });
    await connection.close();
  }
}
