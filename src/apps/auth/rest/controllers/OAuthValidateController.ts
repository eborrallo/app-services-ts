import {Request, Response} from "express";

export class OAuthValidateController {
  constructor() {}

  async run(req: Request, res: Response) {

    res.status(200).send("OK");
  }
}
