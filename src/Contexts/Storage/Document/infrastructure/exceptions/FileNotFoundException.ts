export class FileNotFoundException extends Error {
  constructor(bucket: string, documentId: string) {
    const message = `File ${bucket}_${documentId} not found`;
    super(message);
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.message = message;
  }
}
