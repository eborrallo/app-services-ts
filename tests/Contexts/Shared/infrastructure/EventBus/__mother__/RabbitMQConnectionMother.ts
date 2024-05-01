import {
  RabbitMQConnection
} from '../../../../../../src/Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConnection';
import { RabbitMQConnectionDouble } from '../__mocks__/RabbitMQConnectionDouble';
import { RabbitMQConnectionConfigurationMother } from './RabbitMQConnectionConfigurationMother';
import { StartedTestContainer } from 'testcontainers';

export class RabbitMQConnectionMother {
  static async create() {
    const config = RabbitMQConnectionConfigurationMother.create();
    const connection = new RabbitMQConnection(config);
    await connection.connect();
    return connection;
  }

  static async createFromContainer(container: Promise<StartedTestContainer>) {
    const rabbitContainer = await container;
    const config = {
      connectionSettings: {
        username: 'guest',
        password: 'guest',
        vhost: '/',
        connection: {
          secure: false,
          hostname: rabbitContainer.getHost(),
          port: rabbitContainer.getMappedPort(5672)
        }
      },
      exchangeSettings: { name: '' }
    };
    const connection = new RabbitMQConnection(config);
    await connection.connect();
    return connection;
  }

  static failOnPublish() {
    return new RabbitMQConnectionDouble(RabbitMQConnectionConfigurationMother.create());
  }
}
