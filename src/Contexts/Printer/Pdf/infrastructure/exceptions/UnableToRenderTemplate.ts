export class UnableToRenderTemplate extends Error {
  constructor({ template, previous }:any) {
    super(`Unable to render template ${template} got ${previous.message}`);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
