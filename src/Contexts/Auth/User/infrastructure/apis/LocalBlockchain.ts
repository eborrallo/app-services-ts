import { JsonRpcProvider } from '@ethersproject/providers';

export class LocalBlockchain {
  static get(): JsonRpcProvider {
    return new JsonRpcProvider(`http://localhost:8545/`);
  }
}
