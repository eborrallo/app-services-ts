import { GetAuthTokenQuery } from './GetAuthTokenQuery';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { Query } from '../../../../../Shared/domain/Query';
import { Criteria } from '../../../../../Shared/domain/criteria/Criteria';
import { Filters } from '../../../../../Shared/domain/criteria/Filters';
import { Filter } from '../../../../../Shared/domain/criteria/Filter';
import { FilterField } from '../../../../../Shared/domain/criteria/FilterField';
import { FilterOperator, Operator } from '../../../../../Shared/domain/criteria/FilterOperator';
import { FilterValue } from '../../../../../Shared/domain/criteria/FilterValue';
import { Order } from '../../../../../Shared/domain/criteria/Order';
import {QueryHandler} from "../../../../../Shared/domain/QueryHandler";


export class GetAuthTokenQueryHandler implements QueryHandler<GetAuthTokenQuery, any | null> {
  constructor(private userRepository: UserRepository) {}

  subscribedTo(): Query {
    return GetAuthTokenQuery;
  }

  async handle(command: GetAuthTokenQuery): Promise<string> {
    const criteria = new Criteria(
      new Filters([
        new Filter(new FilterField('address'), new FilterOperator(Operator.EQUAL), new FilterValue(command.address))
      ]),
      Order.none()
    );
    const user = await this.userRepository.find(criteria);
    return user.token!;
  }
}
