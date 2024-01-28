import { DomainEventFailoverPublisher } from '../DomainEventFailoverPublisher/DomainEventFailoverPublisher';
import { RabbitMQConnection } from './RabbitMQConnection';
import { RabbitMQQueueFormatter } from './RabbitMQQueueFormatter';
import { RabbitMQEventBus } from './RabbitMQEventBus';
import { RabbitMQConfig } from './RabbitMQConfig';

export class RabbitMQEventBusFactory {
  static create(
    failoverPublisher: DomainEventFailoverPublisher,
    connection: RabbitMQConnection,
    queueNameFormatter: RabbitMQQueueFormatter,
    config: RabbitMQConfig
  ): RabbitMQEventBus {
    return new RabbitMQEventBus({
      failoverPublisher,
      connection,
      exchange: config.exchangeSettings.name,
      queueNameFormatter: queueNameFormatter,
      maxRetries: config.maxRetries
    });
  }
}
