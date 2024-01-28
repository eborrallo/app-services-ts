import {
  StoreAuthMessageCommandHandler
} from '../../../../../../src/Contexts/Auth/User/application/commands/StoreAuthMessage/StoreAuthMessageCommandHandler';
import {anything, deepEqual, instance, mock, verify, when} from 'ts-mockito';
import {UserRepository} from '../../../../../../src/Contexts/Auth/User/domain/repositories/UserRepository';
import {
  StoreAuthMessageCommand
} from '../../../../../../src/Contexts/Auth/User/application/commands/StoreAuthMessage/StoreAuthMessageCommand';
import {BlockchainUser} from '../../../../../../src/Contexts/Auth/User/domain/models/BlockchainUser';
import {EventBus} from '../../../../../../src/Contexts/Shared/domain/EventBus';

let repository: UserRepository;
let eventBus: EventBus;
let sut: StoreAuthMessageCommandHandler;

beforeEach(() => {
  repository = mock<UserRepository>();
  eventBus = mock<EventBus>();
  sut = new StoreAuthMessageCommandHandler(instance(repository), instance(eventBus));
});

describe('StoreAuthMessage', () => {
  it('store auth message and create user', async () => {
    await sut.handle(new StoreAuthMessageCommand('0x00', 'message'));

    verify(repository.save(anything())).called();
    verify(eventBus.publish(anything())).called();
  });
  it('if user exist update message', async () => {
    when(repository.search(anything())).thenResolve(
      BlockchainUser.fromPrimitives({
        address: '0x00',
        message: 'message'
      })
    );
    await sut.handle(new StoreAuthMessageCommand('0x00', 'message2'));
    verify(repository.save(deepEqual(BlockchainUser.fromPrimitives({address: '0x00', message: 'message2'})))).called();
  });
});
