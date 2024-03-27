import { Document } from '../models/Document';
import { Criteria } from '../../../../Shared/domain/criteria/Criteria';
import { Nullable } from '../../../../Shared/domain/Nullable';

export interface DocumentRepository {
  save(entity: Document): Promise<void>;

  matching(criteria: Criteria): Promise<Array<Document>>;

  find(criteria: Criteria): Promise<Document>;

  search(criteria: Criteria): Promise<Nullable<Document>>;
}
