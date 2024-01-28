import { Query } from '../../../../Shared/domain/Query';

export class RetrieveDocumentQuery extends Query {
  constructor(readonly id: string) {
    super();
  }
}
