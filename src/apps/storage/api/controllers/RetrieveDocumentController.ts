import { Request, Response } from 'express';
import { QueryBus } from '../../../../Contexts/Shared/domain/QueryBus';
import { RetrieveDocumentQuery } from '../../../../Contexts/Storage/Document/application/Retrieve/RetrieveDocumentQuery';
import { FileNotFoundException } from '../../../../Contexts/Storage/Document/infrastructure/exceptions/FileNotFoundException';
import { BucketNotFoundException } from '../../../../Contexts/Storage/Document/infrastructure/exceptions/BucketNotFoundException';
import { InvalidDocumentIdException } from '../../../../Contexts/Storage/Document/domain/exceptions/InvalidDocumentIdException';

export class RetrieveDocumentController {
  constructor(private queryBus: QueryBus) {}

  async run(request: Request, response: Response) {
    const { id } = request.params;

    try {
      const { file, name, metadata } = await this.queryBus.ask(new RetrieveDocumentQuery(id)) as any;
      response.set('Content-Disposition', `attachment; filename=${name}`);

      response.set(metadata);

      file.pipe(response);
    } catch (err: any) {
      const responseCode =
        err instanceof FileNotFoundException ||
        err instanceof BucketNotFoundException ||
        err instanceof InvalidDocumentIdException
          ? 404
          : 500;

      response.status(responseCode).send({
        message: err.message
      });
    }
  }
}
