import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { QueryBus } from '../../../../Contexts/Shared/domain/QueryBus';
import jwt from 'jsonwebtoken';
import config from '../../../../Contexts/Auth/User/infrastructure/config';
import { GetAuthTokenQuery } from '../../../../Contexts/Auth/User/application/queries/GetAuthToken/GetAuthTokenQuery';
import { BoolValue } from '../proto/build/google/protobuf/BoolValue';
import { AuthRequest } from '../proto/build/users/AuthRequest';

export class AuthServices {
  constructor(private queryBus: QueryBus) {}

  async Verify(call: ServerUnaryCall<AuthRequest, BoolValue>, callback: sendUnaryData<BoolValue>): Promise<void> {
    try {
      const existUser = await this.existUserByHash(call.request.hash ?? '');
      callback(null, { value: existUser });
    } catch (e: any) {
      callback(
        {
          name: 'AuthServices:Verify',
          message: e.message
        },
        null
      );
    }
  }

  private async existUserByHash(hash: string): Promise<boolean> {
    const decoded = jwt.verify(hash, config.get('jwtSecret')) as any;

    try {
      const user = await this.queryBus.ask(new GetAuthTokenQuery(decoded.address.toLowerCase()));
      return !!user;
    } catch (e) {
      return false;
    }
  }
}
