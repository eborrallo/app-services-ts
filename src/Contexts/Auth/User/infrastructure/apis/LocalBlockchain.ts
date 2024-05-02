import { JsonRpcProvider } from '@ethersproject/providers';

export class LocalBlockchain {
  static get(): JsonRpcProvider {
    console.log('LocalBlockchain')
    return new JsonRpcProvider(`http://127.0.0.1:8545/`);
  }
}
