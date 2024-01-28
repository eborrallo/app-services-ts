import { Query } from '../../../../../Shared/domain/Query';

export class GetAuthTokenQuery extends Query {
  constructor(readonly address: string) {
    super();
  }
}
