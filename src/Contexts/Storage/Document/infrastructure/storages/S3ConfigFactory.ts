import config from '../config';

export type S3Config = {
  sslEnabled: boolean;
  endpoint: string;
  signatureCache: boolean;
  signatureVersion: string;
  region: string;
  s3ForcePathStyle: boolean;
  accessKeyId: string;
  secretAccessKey: string;
}

export class S3ConfigFactory {
  static create(c?: any): S3Config {
    const configS3 = config.get('s3');
    return {
      sslEnabled: (c ?? configS3).sslEnabled === 'true',
      endpoint: (c ?? configS3).endpoint,
      signatureCache: (c ?? configS3).signatureCache === 'true',
      signatureVersion: (c ?? configS3).signatureVersion,
      region: (c ?? configS3).region,
      s3ForcePathStyle: (c ?? configS3).forcePathStyle === 'true',
      accessKeyId: (c ?? configS3).accessKeyId,
      secretAccessKey: (c ?? configS3).secretAccessKey
      //bucketPrefix: process.env.S3_BUCKET_PREFIX,
    };
  }
}
