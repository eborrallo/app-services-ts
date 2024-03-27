import { Request, Response } from 'express';
import { CommandBus } from '../../../../Contexts/Shared/domain/CommandBus';
import { CreateDocumentCommand } from '../../../../Contexts/Printer/Pdf/application/Create/CreateDocumentCommand';
import Joi from 'joi';
import httpStatus from 'http-status';

export class CreateDocumentController {
  constructor(private commandBus: CommandBus) {
  }

  validate(req: Request, res: Response, next: any) {
    try {
      const schema = Joi.object({
        id: Joi.string().required()
      });

      const validate = schema.validate(req.body);
      if (validate.error) {
        throw new Error(validate.error.message);
      }
      next();
    } catch (e:any) {
      res.status(httpStatus.BAD_REQUEST).send(e.message);
    }
  }

  async run(req: Request, res: Response) {
    try {
      const { id } = req.body;
      await this.commandBus.dispatch(new CreateDocumentCommand(id, 'template', { name: 'John Doe' }));
      res.status(200).send('OK');
    } catch (e: any) {
      console.log(e);
      res.status(500).send();

    }
  }
}
