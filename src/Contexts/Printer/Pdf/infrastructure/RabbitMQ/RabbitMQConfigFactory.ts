import config from '../config';
import { RabbitMQConfig } from '../../../../Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConfig';

export class RabbitMQConfigFactory {
  static createConfig(): RabbitMQConfig {
    return config.get('rabbitmq');
  }
}
