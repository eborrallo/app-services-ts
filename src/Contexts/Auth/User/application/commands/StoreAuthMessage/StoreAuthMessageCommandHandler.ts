import { StoreAuthMessageCommand } from './StoreAuthMessageCommand';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { BlockchainUser } from '../../../domain/models/BlockchainUser';
import { Command } from '../../../../../Shared/domain/Command';
import { CommandHandler } from '../../../../../Shared/domain/CommandHandler';
import { Criteria } from '../../../../../Shared/domain/criteria/Criteria';
import { Filters } from '../../../../../Shared/domain/criteria/Filters';
import { Filter } from '../../../../../Shared/domain/criteria/Filter';
import { FilterField } from '../../../../../Shared/domain/criteria/FilterField';
import { FilterOperator, Operator } from '../../../../../Shared/domain/criteria/FilterOperator';
import { FilterValue } from '../../../../../Shared/domain/criteria/FilterValue';
import { Order } from '../../../../../Shared/domain/criteria/Order';
import { EventBus } from '../../../../../Shared/domain/EventBus';

export class StoreAuthMessageCommandHandler implements CommandHandler<StoreAuthMessageCommand> {
  constructor(private userRepository: UserRepository, private eventBus: EventBus) {}

  subscribedTo(): Command {
    return StoreAuthMessageCommand;
  }

  async handle(command: StoreAuthMessageCommand): Promise<void> {
    try {
      const criteria = new Criteria(
        new Filters([
          new Filter(
            new FilterField('address'),
            new FilterOperator(Operator.EQUAL),
            new FilterValue(command.publicAddress.toLowerCase())
          )
        ]),
        Order.none()
      );
      let user = await this.userRepository.search(criteria);
      if (!user) {
        user = BlockchainUser.create(command.publicAddress.toLowerCase(), command.message);
      } else {
        user.changeNonce(command.message);
      }
      await this.userRepository.save(user);
      await this.eventBus.publish(user.pullDomainEvents());
    } catch (e) {
      console.log(e);
    }
  }
}
