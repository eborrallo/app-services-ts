import { anything, instance, mock, verify, when } from 'ts-mockito';
import { UserRepository } from '../../../../../../src/Contexts/Auth/User/domain/repositories/UserRepository';
import { BlockchainUser } from '../../../../../../src/Contexts/Auth/User/domain/models/BlockchainUser';
import { GetAuthTokenQueryHandler } from '../../../../../../src/Contexts/Auth/User/application/queries/GetAuthToken/GetAuthTokenQueryHandler';
import { GetAuthTokenQuery } from '../../../../../../src/Contexts/Auth/User/application/queries/GetAuthToken/GetAuthTokenQuery';
import { UserNotFound } from '../../../../../../src/Contexts/Auth/User/infrastructure/exceptions/UserNotFound';
import { Criteria } from '../../../../../../src/Contexts/Shared/domain/criteria/Criteria';
import { Filters } from '../../../../../../src/Contexts/Shared/domain/criteria/Filters';
import { Filter } from '../../../../../../src/Contexts/Shared/domain/criteria/Filter';
import { FilterField } from '../../../../../../src/Contexts/Shared/domain/criteria/FilterField';
import { FilterOperator, Operator } from '../../../../../../src/Contexts/Shared/domain/criteria/FilterOperator';
import { FilterValue } from '../../../../../../src/Contexts/Shared/domain/criteria/FilterValue';
import { Order } from '../../../../../../src/Contexts/Shared/domain/criteria/Order';

let repository: UserRepository;
let sut: GetAuthTokenQueryHandler;
beforeEach(() => {
  repository = mock<UserRepository>();
  sut = new GetAuthTokenQueryHandler(instance(repository));
});

describe('GetAuthToken', () => {
  it('retrieve valid auth token', async () => {
    when(repository.find(anything())).thenResolve(
      BlockchainUser.fromPrimitives({
        address: '0x00',
        message: 'message',
        token: 'token'
      })
    );
    const response = await sut.handle(new GetAuthTokenQuery('0x00'));

    verify(repository.find(anything())).called();

    expect(response).toBe('token');
  });
  it('throw exception if user not exist', async () => {
    when(repository.find(anything())).thenReject(
      new UserNotFound(
        new Criteria(
          new Filters([
            new Filter(new FilterField('address'), new FilterOperator(Operator.EQUAL), new FilterValue('0x00'))
          ]),
          Order.none()
        )
      )
    );
    await expect(sut.handle(new GetAuthTokenQuery('0x00'))).rejects.toThrowError('User not found');
  });
});
