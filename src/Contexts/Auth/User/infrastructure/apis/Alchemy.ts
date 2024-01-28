import config from '../config';
import { JsonRpcProvider } from '@ethersproject/providers';

export class Alchemy {
  static get(): JsonRpcProvider {
    console.log(config.get('network'), config.get('alchemyKey'));
    return new JsonRpcProvider(`https://eth-${config.get('network')}.g.alchemy.com/v2/${config.get('alchemyKey')}`);
  }
}
