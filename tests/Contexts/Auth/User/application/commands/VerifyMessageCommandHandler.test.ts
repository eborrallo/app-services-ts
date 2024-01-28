import {anything, instance, mock, verify, when} from 'ts-mockito';
import {UserRepository} from '../../../../../../src/Contexts/Auth/User/domain/repositories/UserRepository';
import {
  VerifyMessageCommandHandler
} from '../../../../../../src/Contexts/Auth/User/application/commands/VerifyMessage/VerifyMessageCommandHandler';
import {SignatureVerificator} from '../../../../../../src/Contexts/Auth/User/domain/services/SignatureVerificator';
import {
  VerifyMessageCommand
} from '../../../../../../src/Contexts/Auth/User/application/commands/VerifyMessage/VerifyMessageCommand';
import {BlockchainUser} from '../../../../../../src/Contexts/Auth/User/domain/models/BlockchainUser';
import {UserNotFound} from '../../../../../../src/Contexts/Auth/User/infrastructure/exceptions/UserNotFound';
import {Criteria} from '../../../../../../src/Contexts/Shared/domain/criteria/Criteria';
import {Filters} from '../../../../../../src/Contexts/Shared/domain/criteria/Filters';
import {Filter} from '../../../../../../src/Contexts/Shared/domain/criteria/Filter';
import {FilterField} from '../../../../../../src/Contexts/Shared/domain/criteria/FilterField';
import {FilterOperator, Operator} from '../../../../../../src/Contexts/Shared/domain/criteria/FilterOperator';
import {FilterValue} from '../../../../../../src/Contexts/Shared/domain/criteria/FilterValue';
import {Order} from '../../../../../../src/Contexts/Shared/domain/criteria/Order';
import {JwtGenerator} from "../../../../../../src/Contexts/Auth/User/domain/services/JwtGenerator";

let repository: UserRepository;
let signatureVerificator: SignatureVerificator;
let jwtGenerator: JwtGenerator;
let sut: VerifyMessageCommandHandler;
beforeEach(() => {
  repository = mock<UserRepository>();
  jwtGenerator = mock<JwtGenerator>();
  signatureVerificator = mock<SignatureVerificator>();
  sut = new VerifyMessageCommandHandler(instance(repository), instance(signatureVerificator), instance(jwtGenerator));
});

describe('VerifyMessage', () => {
  it('verify message and update token', async () => {
    when(repository.find(anything())).thenResolve(
      BlockchainUser.fromPrimitives({
        address: '0x00',
        message: 'message'
      })
    );
    await sut.handle(new VerifyMessageCommand('0x00', 'signature'));

    verify(signatureVerificator.verifyMessage('message', 'signature', '0x00')).called();
    verify(repository.save(anything())).called();
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
    await expect(sut.handle(new VerifyMessageCommand('0x00', 'signature'))).rejects.toThrowError('User not found');
  });
});
