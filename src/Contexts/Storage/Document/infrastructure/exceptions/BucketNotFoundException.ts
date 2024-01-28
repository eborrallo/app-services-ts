export class BucketNotFoundException extends Error {
  constructor() {
    const message = 'Bucket not found';
    super(message);
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.message = message;
  }
}
