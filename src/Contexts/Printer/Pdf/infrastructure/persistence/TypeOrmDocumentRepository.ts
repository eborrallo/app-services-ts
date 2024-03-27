import { SelectQueryBuilder } from 'typeorm';
import { Nullable } from '../../../../Shared/domain/Nullable';
import { TypeOrmRepository } from '../../../../Shared/infrastructure/persistence/typeorm/TypeOrmRepository';
import { Document } from '../../domain/models/Document';
import { DocumentRepository } from '../../domain/repositories/DocumentRepository';
import { Criteria } from '../../../../Shared/domain/criteria/Criteria';
import { DocumentNotFound } from '../exceptions/DocumentNotFound';
import { TypeOrmCriteriaConverter } from '../../../../Shared/infrastructure/persistence/typeorm/TypeOrmCriteriaConverter';
import { DocumentEntity } from './typeorm/DocumentEntity';

export class TypeOrmDocumentRepository extends TypeOrmRepository<Document> implements DocumentRepository {
  protected entitySchema(): any {
    return DocumentEntity;
  }

  public save(course: Document): Promise<void> {
    return this.persist(course);
  }

  public async matching(criteria: Criteria): Promise<Document[]> {
    const users = await this.searchByCriteria(criteria);

    return users.map((user: any) => Document.fromPrimitives(user));
  }

  public async search(criteria: Criteria): Promise<Nullable<Document>> {
    const document = await this.searchOneByCriteria(criteria);

    return document ? Document.fromPrimitives(document) : null;
  }

  public async find(criteria: Criteria): Promise<Document> {
    const document = await this.searchOneByCriteria(criteria);
    if (document) return Document.fromPrimitives(document);
    throw new DocumentNotFound(criteria);
  }

  private async searchByCriteria(criteria: Criteria): Promise<Document[]> {
    const criteriaConverter = new TypeOrmCriteriaConverter();
    const repository = await this.repository();

    const query = repository.createQueryBuilder(TypeOrmCriteriaConverter.PREFIX);

    const queryBuilded = criteriaConverter.convert(criteria, query) as SelectQueryBuilder<Document>;

    return queryBuilded.getMany();
  }

  private async searchOneByCriteria(criteria: Criteria): Promise<Document | null> {
    const criteriaConverter = new TypeOrmCriteriaConverter();
    const repository = await this.repository();

    const query = repository.createQueryBuilder(TypeOrmCriteriaConverter.PREFIX);

    const queryBuilded = criteriaConverter.convert(criteria, query) as SelectQueryBuilder<Document>;

    return queryBuilded.getOne();
  }
}
