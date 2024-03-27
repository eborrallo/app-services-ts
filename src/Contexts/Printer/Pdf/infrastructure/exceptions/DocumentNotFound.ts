import { Criteria } from '../../../../Shared/domain/criteria/Criteria';

export class DocumentNotFound extends Error {
  constructor(criteria: Criteria) {
    super(`Document not found for criteria ${criteria.serialize()}`);
  }
}
