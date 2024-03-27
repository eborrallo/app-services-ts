export class BrowserError extends Error {
  constructor(error: any) {
    const message = `Unable to print PDF: ${error}`;

    super(message);

    if (error && error.stack) {
      this.stack = error.stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = this.constructor.name;
  }
}
