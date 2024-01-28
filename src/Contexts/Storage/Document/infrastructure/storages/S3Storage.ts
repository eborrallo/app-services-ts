import { S3 } from 'aws-sdk';
import { BucketNotFoundException } from '../exceptions/BucketNotFoundException';
import * as stream from 'stream';
import { FileNotFoundException } from '../exceptions/FileNotFoundException';
import { Storage } from '../../domain/services/Storage';
import config from '../config';

export class S3Storage implements Storage {
  constructor(private s3Client: S3) {}

  async upload(file: any, bucket: any) {
    try {
      await this.s3Client
        .putObject({
          Bucket: (config.get('s3.bucketPrefix') || '') + bucket,
          Key: file.id,
          Body: file.body,
          Metadata: file.metadata,
          ContentType: file.metadata['Content-Type'.toLowerCase()]
        })
        .promise();
    } catch (err: any) {
      if (err.statusCode === 404) {
        throw new BucketNotFoundException();
      }
      throw err;
    }
  }

  async retrieve(bucket: string, documentId: string) {
    try {
      const { Body, ContentType, Metadata } = await this.s3Client
        .getObject({
          Bucket: (config.get('s3.bucketPrefix') || '') + bucket,
          Key: documentId
        })
        .promise();
      const readStream = new stream.PassThrough();
      readStream.end(Body);

      return {
        file: readStream,
        name: Metadata!['x-document-name'] || documentId,
        metadata: { 'Content-Type': ContentType, ...Metadata }
      };
    } catch (err: any) {
      if (err.code === 'NoSuchKey') {
        throw new FileNotFoundException(bucket, documentId);
      }

      throw err;
    }
  }
}
