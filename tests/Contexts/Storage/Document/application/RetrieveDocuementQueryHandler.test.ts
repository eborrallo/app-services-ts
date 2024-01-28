import { anything, instance, mock, verify, when } from 'ts-mockito';
import { RetrieveDocumentQueryHandler } from '../../../../../src/Contexts/Storage/Document/application/Retrieve/RetrieveDocumentQueryHandler';
import { Storage } from '../../../../../src/Contexts/Storage/Document/domain/services/Storage';
import { RetrieveDocumentQuery } from '../../../../../src/Contexts/Storage/Document/application/Retrieve/RetrieveDocumentQuery';

let storage: Storage;
let sut: RetrieveDocumentQueryHandler;

beforeEach(() => {
  storage = mock<Storage>();
  when(storage.retrieve(anything(), anything())).thenResolve({ file: 'file', name: 'name', metadata: 'metadata' });
  sut = new RetrieveDocumentQueryHandler(instance(storage));
});

describe('RetrieveDocument', () => {
  it('Should return a document', async () => {
    const result = await sut.handle(new RetrieveDocumentQuery('bucket_123'));

    verify(storage.retrieve('bucket', '123')).called();
    expect(result).toEqual({ file: 'file', name: 'name', metadata: 'metadata' });
  });
  it('Should throw exception', async () => {
    await expect(sut.handle(new RetrieveDocumentQuery('123'))).rejects.toThrowError(
      `Invalid DocumentId ${123}. It should contain <bucket>_<document_id>`
    );
  });
});
