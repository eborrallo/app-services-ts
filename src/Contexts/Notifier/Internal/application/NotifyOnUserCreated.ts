import { DomainEventSubscriber } from '../../../Shared/domain/DomainEventSubscriber';
import Logger from '../../../Shared/domain/Logger';
import { DomainEventClass } from '../../../Shared/domain/DomainEvent';
import { UserCreatedDomainEvent } from '../../../Auth/User/domain/events/UserCreatedDomainEvent';

export class NotifyOnUserCreated implements DomainEventSubscriber<UserCreatedDomainEvent> {
  constructor(private logger: Logger) {}

  subscribedTo(): DomainEventClass[] {
    return [UserCreatedDomainEvent];
  }

  async on(domainEvent: UserCreatedDomainEvent): Promise<void> {
    this.logger.info(`UserCreatedDomainEvent: ${JSON.stringify(domainEvent.toPrimitives())}`);
  }
}
