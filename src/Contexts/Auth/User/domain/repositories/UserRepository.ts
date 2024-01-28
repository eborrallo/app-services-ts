import { BlockchainUser } from '../models/BlockchainUser';
import { Criteria } from '../../../../Shared/domain/criteria/Criteria';
import { Nullable } from '../../../../Shared/domain/Nullable';

export interface UserRepository {
  save(entity: BlockchainUser): Promise<void>;

  matching(criteria: Criteria): Promise<Array<BlockchainUser>>;
  find(criteria: Criteria): Promise<BlockchainUser>;
  search(criteria: Criteria): Promise<Nullable<BlockchainUser>>;
}
