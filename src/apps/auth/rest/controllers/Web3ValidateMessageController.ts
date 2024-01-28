import {CommandBus} from '../../../../Contexts/Shared/domain/CommandBus';
import {QueryBus} from '../../../../Contexts/Shared/domain/QueryBus';
import Logger from '../../../../Contexts/Shared/domain/Logger';
import {
  VerifyMessageCommand
} from '../../../../Contexts/Auth/User/application/commands/VerifyMessage/VerifyMessageCommand';
import {GetAuthTokenQuery} from '../../../../Contexts/Auth/User/application/queries/GetAuthToken/GetAuthTokenQuery';
import {Request, Response} from 'express';
import httpStatus from "http-status";

export class Web3ValidateMessageController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus, private logger: Logger) {
  }

  async run(req: Request, res: Response) {
    const {signature} = req.body;
    const publicAddress: string = req.params.address as string;

    try {
      await this.commandBus.dispatch(new VerifyMessageCommand(publicAddress.toLowerCase(), signature));
      const token = await this.queryBus.ask(new GetAuthTokenQuery(publicAddress.toLowerCase()));

      res.status(httpStatus.OK).send({token});
    } catch (e: any) {
      this.logger.error(e);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }
}
