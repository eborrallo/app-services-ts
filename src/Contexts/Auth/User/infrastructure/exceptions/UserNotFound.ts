import { Criteria } from '../../../../Shared/domain/criteria/Criteria';

export class UserNotFound extends Error {
  constructor(criteria: Criteria) {
    super(`User not found for criteria ${criteria.serialize()}`);
  }
}
