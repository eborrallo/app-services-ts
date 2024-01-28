import assert from 'assert';
import { Given } from '@cucumber/cucumber';
import { UserRepository } from '../../../../src/Contexts/Auth/User/domain/repositories/UserRepository';
import { Criteria } from '../../../../src/Contexts/Shared/domain/criteria/Criteria';
import { Filters } from '../../../../src/Contexts/Shared/domain/criteria/Filters';
import { Filter } from '../../../../src/Contexts/Shared/domain/criteria/Filter';
import { FilterField } from '../../../../src/Contexts/Shared/domain/criteria/FilterField';
import { FilterOperator, Operator } from '../../../../src/Contexts/Shared/domain/criteria/FilterOperator';
import { FilterValue } from '../../../../src/Contexts/Shared/domain/criteria/FilterValue';
import { Order } from '../../../../src/Contexts/Shared/domain/criteria/Order';
import { BlockchainUser } from '../../../../src/Contexts/Auth/User/domain/models/BlockchainUser';
import container from "../../../../src/apps/auth/rest/dependency-injection";

Given('existing user', async (json: string) => {
  const repository = container.get('UserRepository') as UserRepository;
  const users = JSON.parse(json);
  for (const key in users) {
    const _user = users[key];
    const user = BlockchainUser.fromPrimitives({
      address: _user.address,
      message: _user.message,
      token: _user.token,
      refreshToken: _user.refreshToken
    });

    await repository.save(user);
  }
});

Given('user {string} should exist', async (address: string) => {
  const repository = container.get('UserRepository') as UserRepository;

  const criteria = new Criteria(
    new Filters([
      new Filter(new FilterField('address'), new FilterOperator(Operator.EQUAL), new FilterValue(address.toLowerCase()))
    ]),
    Order.none()
  );
  const user = await repository.matching(criteria);
  assert(user != null);
});
