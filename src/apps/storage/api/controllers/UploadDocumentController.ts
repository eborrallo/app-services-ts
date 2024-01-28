import { CommandBus } from '../../../../Contexts/Shared/domain/CommandBus';
import { UploadDocumentCommand } from '../../../../Contexts/Storage/Document/application/Upload/UploadDocumentCommand';
import { Request, Response } from 'express';
import { HeadersBuilder } from '../../../../Contexts/Storage/Document/domain/services/HeadersBuilder';
import Joi from 'joi';
import httpStatus from 'http-status';
import { v4 } from 'uuid';
import { BucketNotFoundException } from '../../../../Contexts/Storage/Document/infrastructure/exceptions/BucketNotFoundException';

export class UploadDocumentController {
  constructor(private commandBus: CommandBus) {}

  validate(req: Request, res: Response, next: any) {
    try {
      const uploadDocumentRequiredParams = Object.values(HeadersBuilder.requiredHeaderTypes());
      const joiValidation = [
        {
          keyByField: true,
          abortEarly: false,
          allowUnknown: true
        },
        {
          abortEarly: false,
          allowUnknown: true
        }
      ];
      const schema = Joi.object({
        headers: Joi.object({
          ...uploadDocumentRequiredParams
            .map(p => ({ argument: p, type: Joi.string().required() }))
            .reduce((obj: any, item: any) => ((obj[item.argument] = item.type), obj), {})
        }),
        body: Joi.binary().required().label('document')
      }).required();

      const validate = schema.validate(req, ...joiValidation);
      if (validate.error) {
        throw new Error(validate.error.message);
      }
      next();
    } catch (e: any) {
      console.log(req.headers);
      console.log(e.message);

      res.status(httpStatus.BAD_REQUEST).send(e.message);
    }
  }

  async run(request: Request, response: Response) {
    const { body, headers } = request;
    const headerTypes = HeadersBuilder.requiredHeaderTypes();
    const { [headerTypes.bucket]: bucket } = headers;
    const id = v4();

    try {
      await this.commandBus.dispatch(new UploadDocumentCommand(id, body, headers));

      response.status(201).send({
        id: `${bucket}_${id}`
      });
    } catch (err: any) {
      console.log(err);
      response.status(err instanceof BucketNotFoundException ? 404 : 500).send({
        message: err.message
      });
    }
  }
}
