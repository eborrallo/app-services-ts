import { ConnectionSettings } from './ConnectionSettings';
import { ExchangeSetting } from './ExchangeSetting';

export type RabbitMQConfig = {
  connectionSettings: ConnectionSettings;
  exchangeSettings: ExchangeSetting;
  maxRetries: number;
  retryTtl: number;
};
