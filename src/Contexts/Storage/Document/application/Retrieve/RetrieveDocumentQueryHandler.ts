import { RetrieveDocumentQuery } from './RetrieveDocumentQuery';
import { Query } from '../../../../Shared/domain/Query';
import { InvalidDocumentIdException } from '../../domain/exceptions/InvalidDocumentIdException';
import { Storage } from '../../domain/services/Storage';
import {QueryHandler} from "../../../../Shared/domain/QueryHandler";

export class RetrieveDocumentQueryHandler implements QueryHandler<RetrieveDocumentQuery, any | null> {
  constructor(private storage: Storage) {}

  subscribedTo(): Query {
    return RetrieveDocumentQuery;
  }

  async handle(command: RetrieveDocumentQuery): Promise<{ file: any; name: string; metadata: any }> {
    const [bucket, documentId] = command.id.split('_');
    if (!documentId) {
      throw new InvalidDocumentIdException(command.id);
    }
    const { file, name, metadata } = await this.storage.retrieve(bucket, documentId);
    return { file, name, metadata };
  }
}
