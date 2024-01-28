import { VerifyMessageCommand } from './VerifyMessageCommand';
import { SignatureVerificator } from '../../../domain/services/SignatureVerificator';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { JwtGenerator } from '../../../domain/services/JwtGenerator';
import { CommandHandler } from '../../../../../Shared/domain/CommandHandler';
import { Command } from '../../../../../Shared/domain/Command';
import { Criteria } from '../../../../../Shared/domain/criteria/Criteria';
import { Filters } from '../../../../../Shared/domain/criteria/Filters';
import { Filter } from '../../../../../Shared/domain/criteria/Filter';
import { FilterField } from '../../../../../Shared/domain/criteria/FilterField';
import { FilterOperator, Operator } from '../../../../../Shared/domain/criteria/FilterOperator';
import { FilterValue } from '../../../../../Shared/domain/criteria/FilterValue';
import { Order } from '../../../../../Shared/domain/criteria/Order';

export class VerifyMessageCommandHandler implements CommandHandler<VerifyMessageCommand> {
  constructor(
    private userRepository: UserRepository,
    private verificator: SignatureVerificator,
    private jwtGenerator: JwtGenerator
  ) {}

  subscribedTo(): Command {
    return VerifyMessageCommand;
  }

  async handle(command: VerifyMessageCommand): Promise<void> {
    const criteria = new Criteria(
      new Filters([
        new Filter(
          new FilterField('address'),
          new FilterOperator(Operator.EQUAL),
          new FilterValue(command.publicAddress)
        )
      ]),
      Order.none()
    );
    const user = await this.userRepository.find(criteria);
    await this.verificator.verifyMessage(user.message, command.signature, command.publicAddress);
    const token = this.jwtGenerator.generate(command.publicAddress);
    user.changeToken(token);
    await this.userRepository.save(user);
  }
}
