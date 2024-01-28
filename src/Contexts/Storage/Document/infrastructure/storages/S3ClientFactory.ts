import { S3 } from 'aws-sdk';
import config from '../config';

export class S3ClientFactory {
  static create(): S3 {
    return new S3({
      sslEnabled: config.get('s3.sslEnabled') === 'true',
      endpoint: config.get('s3.endpoint'),
      signatureCache: config.get('s3.signatureCache') === 'true',
      signatureVersion: config.get('s3.signatureVersion'),
      region: config.get('s3.region'),
      s3ForcePathStyle: config.get('s3.forcePathStyle') === 'true',
      accessKeyId: config.get('s3.accessKeyId'),
      secretAccessKey: config.get('s3.secretAccessKey')
      //bucketPrefix: process.env.S3_BUCKET_PREFIX,
    });
  }
}
