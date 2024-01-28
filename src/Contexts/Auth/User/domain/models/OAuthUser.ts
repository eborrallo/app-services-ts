import { AggregateRoot } from '../../../../Shared/domain/AggregateRoot';
import { UserCreatedDomainEvent } from '../events/UserCreatedDomainEvent';

export class OAuthUser extends AggregateRoot {
  constructor(readonly id: string, public address: string) {
    super();
  }


  static fromPrimitives(plainData: Partial<OAuthUser>): OAuthUser {
    return new OAuthUser(plainData.id!, plainData.address!);
  }

  static create(id: string, address: string): OAuthUser {
    const course = new OAuthUser(id, address);

    course.record(
      new UserCreatedDomainEvent({
        aggregateId: id,
        address: address
      })
    );

    return course;
  }

  toPrimitives(): any {
    return {
      id: this.id,
      address: this.address,
    };
  }
}
