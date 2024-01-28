import { EventBus } from '../../../Contexts/Shared/domain/EventBus';
import container from './dependency-injection';
import { DomainEventSubscribers } from '../../../Contexts/Shared/infrastructure/EventBus/DomainEventSubscribers';
import { Server } from './server';
import { RabbitMQConnection } from '../../../Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConnection';

export class AuthApp {
  server?: Server;

  async start() {
    const port = process.env.PORT || '3000';
    this.server = new Server(port);

    await this.configureEventBus();

    return this.server.listen();
  }

  get httpServer() {
    return this.server?.getHTTPServer();
  }

  async stop() {
    const rabbitMQConnection = container.get<RabbitMQConnection>('Auth.Shared.RabbitMQConnection');
    await rabbitMQConnection.close();
    return this.server?.stop();
  }

  private async configureEventBus(): Promise<void> {
    const eventBus = container.get<EventBus>('Auth.Shared.domain.EventBus');
    const rabbitMQConnection = container.get<RabbitMQConnection>('Auth.Shared.RabbitMQConnection');
    await rabbitMQConnection.connect();

    eventBus.addSubscribers(DomainEventSubscribers.from(container));
  }
}
