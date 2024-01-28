import { AggregateRoot } from '../../../../Shared/domain/AggregateRoot';
import { UserCreatedDomainEvent } from '../events/UserCreatedDomainEvent';

export class BlockchainUser extends AggregateRoot {
  constructor(readonly address: string, public message: string, public token?: string, public refreshToken?: string) {
    super();
  }

  changeNonce(message: string) {
    this.message = message;
  }

  changeToken(token: string) {
    this.token = token;
  }

  static fromPrimitives(plainData: Partial<BlockchainUser>): BlockchainUser {
    return new BlockchainUser(plainData.address!, plainData.message!, plainData.token, plainData.refreshToken);
  }

  static create(address: string, message: string): BlockchainUser {
    const course = new BlockchainUser(address, message);

    course.record(
      new UserCreatedDomainEvent({
        aggregateId: address,
        address: address
      })
    );

    return course;
  }

  toPrimitives(): any {
    return {
      address: this.address,
      message: this.message,
      token: this.token,
      refreshToken: this.refreshToken
    };
  }
}
