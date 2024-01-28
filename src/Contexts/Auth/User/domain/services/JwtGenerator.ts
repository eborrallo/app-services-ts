import jwt from 'jsonwebtoken';
import config from '../../infrastructure/config';

export class JwtGenerator {
  generate(text: string) {
    return jwt.sign({ address: text }, config.get('jwtSecret'), { expiresIn: '1h' });
  }

  decode(token: string) {
    return jwt.verify(token, config.get('jwtSecret'));
  }
}
