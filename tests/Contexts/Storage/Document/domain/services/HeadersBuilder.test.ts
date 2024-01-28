import { HeadersBuilder } from '../../../../../../src/Contexts/Storage/Document/domain/services/HeadersBuilder';

describe('HeadersBuilder', () => {
  it('should return required header types', () => {
    expect(HeadersBuilder.requiredHeaderTypes()).toMatchObject({
      source: 'x-source',
      bucket: 'x-bucket',
      contentType: 'content-type'
    });
  });
  it('should return optional header types', () => {
    expect(HeadersBuilder.optionalHeaderTypes()).toMatchObject({
      customXmeta: 'x-meta-',
      correlationId: 'x-correlation-id',
      documentName: 'x-document-name'
    });
  });
  it('should return custom x headers', () => {
    const headers = {
      'x-source': 'source',
      'x-bucket': 'bucket',
      'content-type': 'content-type',
      'x-meta-': 'meta',
      'x-correlation-id': 'correlation-id',
      'x-document-name': 'document-name',
      'x-meta-custom': 'custom',
      'x-custom': 'custom'
    };
    expect(HeadersBuilder.customXHeaders({ headers })).toStrictEqual({
      'x-source': 'source',
      'x-bucket': 'bucket',
      'content-type': 'content-type',
      'x-meta-': 'meta',
      'x-correlation-id': 'correlation-id',
      'x-document-name': 'document-name',
      'x-meta-custom': 'custom'
    });
  });
});
