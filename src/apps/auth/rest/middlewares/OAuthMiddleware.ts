import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import {AuthGuard} from "../../../../Contexts/Auth/User/application/guard/AuthGuard";

export class OAuthMiddleware {
  private validator: AuthGuard;

  constructor(validator: AuthGuard) {
    this.validator = validator;
  }

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.validator.validate(req.headers.authorization);
      req.body.user = user;
      next();
    } catch (e: any) {
      return res.status(httpStatus.FORBIDDEN).json({ error: e.message });
    }
  }
}
