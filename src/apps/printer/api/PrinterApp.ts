import { EventBus } from '../../../Contexts/Shared/domain/EventBus';
import container from './dependency-injection';
import { DomainEventSubscribers } from '../../../Contexts/Shared/infrastructure/EventBus/DomainEventSubscribers';
import { RabbitMQConnection } from '../../../Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConnection';
import { Server } from './server';

export class PrinterApp {
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
    const rabbitMQConnection = container.get<RabbitMQConnection>('Printer.Shared.RabbitMQConnection');
    await rabbitMQConnection.close();
    return this.server?.stop();

  }

  private async configureEventBus() {
    const eventBus = container.get<EventBus>('Printer.Shared.domain.EventBus');
    const rabbitMQConnection = container.get<RabbitMQConnection>('Printer.Shared.RabbitMQConnection');
    await rabbitMQConnection.connect();

    eventBus.addSubscribers(DomainEventSubscribers.from(container));
  }
}
