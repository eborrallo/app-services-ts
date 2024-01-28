export class InvalidDocumentIdException extends Error {
  constructor(id: string) {
    const message = `Invalid DocumentId ${id}. It should contain <bucket>_<document_id>`;
    super(message);
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.message = message;
  }
}
