import { Criteria } from '../../../../Shared/domain/criteria/Criteria';
import { MongoRepository } from '../../../../Shared/infrastructure/persistence/mongo/MongoRepository';
import { Document } from '../../domain/models/Document';
import { DocumentRepository } from '../../domain/repositories/DocumentRepository';
import { Nullable } from '../../../../Shared/domain/Nullable';
import { DocumentNotFound } from '../exceptions/DocumentNotFound';

export class MongoDocumentRepository extends MongoRepository<Document> implements DocumentRepository {
  public save(user: Document): Promise<void> {
    return this.persist(user.id, user);
  }

  protected collectionName(): string {
    return 'users';
  }

  public async matching(criteria: Criteria): Promise<Document[]> {
    const documents = await this.searchByCriteria<Document>(criteria);

    return documents.map(document => Document.fromPrimitives(document));
  }

  public async search(criteria: Criteria): Promise<Nullable<Document>> {
    const document = await this.searchOneByCriteria<Document>(criteria);
    return document ? Document.fromPrimitives(document) : null;
  }

  public async find(criteria: Criteria): Promise<Document> {
    const document = await this.searchOneByCriteria<Document>(criteria);
    if (document) return Document.fromPrimitives(document);
    throw new DocumentNotFound(criteria);
  }
}
