import { SelectQueryBuilder } from 'typeorm';
import { Nullable } from '../../../../Shared/domain/Nullable';
import { TypeOrmRepository } from '../../../../Shared/infrastructure/persistence/typeorm/TypeOrmRepository';
import { BlockchainUser } from '../../domain/models/BlockchainUser';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { Criteria } from '../../../../Shared/domain/criteria/Criteria';
import { UserNotFound } from '../exceptions/UserNotFound';
import { TypeOrmCriteriaConverter } from '../../../../Shared/infrastructure/persistence/typeorm/TypeOrmCriteriaConverter';
import { UserEntity } from './typeorm/UserEntity';

export class TypeOrmUserRepository extends TypeOrmRepository<BlockchainUser> implements UserRepository {
  protected entitySchema(): any {
    return UserEntity;
  }

  public save(course: BlockchainUser): Promise<void> {
    return this.persist(course);
  }

  public async matching(criteria: Criteria): Promise<BlockchainUser[]> {
    const users = await this.searchByCriteria(criteria);

    return users.map((user: any) => BlockchainUser.fromPrimitives(user));
  }

  public async search(criteria: Criteria): Promise<Nullable<BlockchainUser>> {
    const document = await this.searchOneByCriteria(criteria);

    return document ? BlockchainUser.fromPrimitives(document) : null;
  }

  public async find(criteria: Criteria): Promise<BlockchainUser> {
    const document = await this.searchOneByCriteria(criteria);
    if (document) return BlockchainUser.fromPrimitives(document);
    throw new UserNotFound(criteria);
  }

  private async searchByCriteria(criteria: Criteria): Promise<BlockchainUser[]> {
    const criteriaConverter = new TypeOrmCriteriaConverter();
    const repository = await this.repository();

    const query = repository.createQueryBuilder(TypeOrmCriteriaConverter.PREFIX);

    const queryBuilded = criteriaConverter.convert(criteria, query) as SelectQueryBuilder<BlockchainUser>;

    return queryBuilded.getMany();
  }

  private async searchOneByCriteria(criteria: Criteria): Promise<BlockchainUser | null> {
    const criteriaConverter = new TypeOrmCriteriaConverter();
    const repository = await this.repository();

    const query = repository.createQueryBuilder(TypeOrmCriteriaConverter.PREFIX);

    const queryBuilded = criteriaConverter.convert(criteria, query) as SelectQueryBuilder<BlockchainUser>;

    return queryBuilded.getOne();
  }
}
