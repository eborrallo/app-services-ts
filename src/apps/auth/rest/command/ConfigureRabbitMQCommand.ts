import { DomainEventSubscribers } from '../../../../Contexts/Shared/infrastructure/EventBus/DomainEventSubscribers';
import { RabbitMQConfigurer } from '../../../../Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConfigurer';
import { RabbitMQConnection } from '../../../../Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConnection';
import { RabbitMQQueueFormatter } from '../../../../Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQQueueFormatter';
import container from '../dependency-injection';
import { RabbitMQConfig } from '../../../../Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConfig';

export class ConfigureRabbitMQCommand {
  static async run(config?:any) {
    const connection = container.get<RabbitMQConnection>('Auth.Shared.RabbitMQConnection');
    const nameFormatter = container.get<RabbitMQQueueFormatter>('Auth.Shared.RabbitMQQueueFormatter');
    const { exchangeSettings, retryTtl } = container.get<RabbitMQConfig>('Auth.Shared.RabbitMQConfig');

    await connection.connect(config);

    const configurer = new RabbitMQConfigurer(connection, nameFormatter, retryTtl);
    const subscribers = DomainEventSubscribers.from(container).items;

    await configurer.configure({ exchange: exchangeSettings.name, subscribers });
    await connection.close();
  }
}
