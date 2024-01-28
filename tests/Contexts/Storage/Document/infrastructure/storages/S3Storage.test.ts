import { AWSError, S3 } from 'aws-sdk';
import { anything, deepEqual, instance, mock, verify, when } from 'ts-mockito';
import { S3Storage } from '../../../../../../src/Contexts/Storage/Document/infrastructure/storages/S3Storage';

let s3Client: S3;
let sut: S3Storage;

beforeAll(() => {
  s3Client = mock<S3>();
  sut = new S3Storage(instance(s3Client));
});

describe('S3Storage', () => {
  it('should upload', async () => {
    when(s3Client.putObject(anything())).thenReturn({ promise: () => null } as any);
    await sut.upload(
      {
        id: 'id',
        body: 'body',
        metadata: {
          'Content-Type': 'content-type'
        }
      },
      'bucket'
    );
    verify(s3Client.putObject(anything())).called();
  });
  it('should throw error on upload', async () => {
    when(s3Client.putObject(anything())).thenReturn({
      promise: () => {
        const error = { statusCode: 404 };
        throw error as AWSError;
      }
    } as any);

    await expect(
      sut.upload(
        {
          id: 'id',
          body: 'body',
          metadata: {
            'Content-Type': 'content-type'
          }
        },
        'bucket'
      )
    ).rejects.toThrowError('Bucket not found');
  });
  it('should download', async () => {
    when(
      s3Client.getObject(
        deepEqual({
          Bucket: 'bucket',
          Key: 'id'
        })
      )
    ).thenReturn({
      promise() {
        return Promise.resolve({
          Body: 'body',
          ContentType: 'content-type',
          Metadata: {
            'x-document-name': 'name'
          }
        });
      }
    } as any);
    const result = await sut.retrieve('bucket', 'id');
    expect(result).toMatchObject({
      file: anything(),
      name: 'name',
      metadata: {
        'Content-Type': 'content-type',
        'x-document-name': 'name'
      }
    });
  });
  it('should throw error on download', async () => {
    when(
      s3Client.getObject(
        deepEqual({
          Bucket: 'bucket',
          Key: 'id'
        })
      )
    ).thenReturn({
      promise() {
        const error = { code: 'NoSuchKey' };
        throw error as AWSError;
      }
    } as any);
    await expect(sut.retrieve('bucket', 'id')).rejects.toThrowError('File bucket_id not found');
  });
});
