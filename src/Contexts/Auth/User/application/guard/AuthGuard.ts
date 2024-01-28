import {AuthValidation} from '../../domain/services/AuthValidation';

export class AuthGuard {
  private auth: AuthValidation;

  constructor(auth: AuthValidation) {
    this.auth = auth;
  }

  async validate(authorization?: string): Promise<void> {
    if (!authorization) {
      throw new Error('No credentials sent!');
    }

    try {
      await this.auth.verify(authorization);
    } catch (error) {
      throw new Error('Authorization error');
    }
  }
}
