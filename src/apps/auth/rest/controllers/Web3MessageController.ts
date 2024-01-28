import {CommandBus} from '../../../../Contexts/Shared/domain/CommandBus';
import {MessageGenerator} from '../services/MessageGenerator';
import {Request, Response} from 'express';
import {
  StoreAuthMessageCommand
} from '../../../../Contexts/Auth/User/application/commands/StoreAuthMessage/StoreAuthMessageCommand';
import httpStatus from "http-status";
import Logger from "../../../../Contexts/Shared/domain/Logger";

export class Web3MessageController {
  constructor(private commandBus: CommandBus, private logger: Logger) {
  }

  async run(req: Request, res: Response) {
    const origin = req.get('origin');
    const publicAddress: string = req.params.address as string;
    try {

      const message = MessageGenerator.generate(publicAddress, origin);
      await this.commandBus.dispatch(new StoreAuthMessageCommand(publicAddress, message));

      res.status(httpStatus.OK).send({message});
    } catch (e: any) {
      this.logger.error(e);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }
}
