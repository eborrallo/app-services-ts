import { S3 } from 'aws-sdk';
import { S3Config } from './S3ConfigFactory';

export class S3ClientFactory {
  static create(config:S3Config): S3 {
    return new S3(config);
  }
}
