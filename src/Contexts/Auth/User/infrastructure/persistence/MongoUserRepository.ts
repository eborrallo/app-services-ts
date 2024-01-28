import { Criteria } from '../../../../Shared/domain/criteria/Criteria';
import { MongoRepository } from '../../../../Shared/infrastructure/persistence/mongo/MongoRepository';
import { BlockchainUser } from '../../domain/models/BlockchainUser';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { Nullable } from '../../../../Shared/domain/Nullable';
import { UserNotFound } from '../exceptions/UserNotFound';

export class MongoUserRepository extends MongoRepository<BlockchainUser> implements UserRepository {
  public save(user: BlockchainUser): Promise<void> {
    return this.persist(user.address, user);
  }

  protected collectionName(): string {
    return 'users';
  }

  public async matching(criteria: Criteria): Promise<BlockchainUser[]> {
    const documents = await this.searchByCriteria<BlockchainUser>(criteria);

    return documents.map(document => BlockchainUser.fromPrimitives(document));
  }

  public async search(criteria: Criteria): Promise<Nullable<BlockchainUser>> {
    const document = await this.searchOneByCriteria<BlockchainUser>(criteria);

    return document ? BlockchainUser.fromPrimitives(document) : null;
  }

  public async find(criteria: Criteria): Promise<BlockchainUser> {
    const document = await this.searchOneByCriteria<BlockchainUser>(criteria);
    if (document) return BlockchainUser.fromPrimitives(document);
    throw new UserNotFound(criteria);
  }
}
