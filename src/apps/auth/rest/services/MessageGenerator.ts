import * as crypto from 'crypto';
import config from '../../../../Contexts/Auth/User/infrastructure/config';

export class MessageGenerator {
  static generate(ethereumAddress: string, origin?: any | null) {
    const text = `${
      origin || 'unknown'
    } wants you to sign in with your Ethereum account: ${ethereumAddress} Sign in with ethereum to URI: ${
      origin || 'unknown'
    } Version: 1 Network: ${config.get('network')} Nonce: ${crypto
      .randomBytes(8)
      .toString('hex')} Issued At: ${new Date().toISOString()}`;

    return text;
  }
}
