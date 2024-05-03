export class BucketNotFoundException extends Error {
  constructor(bucketName: string) {
    const message = 'Bucket not found: ' + bucketName;
    super(message);
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.message = message;
  }
}
