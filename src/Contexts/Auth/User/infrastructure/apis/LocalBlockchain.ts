import { JsonRpcProvider } from '@ethersproject/providers';

export class LocalBlockchain {
  static get(port:number): JsonRpcProvider {
    console.log('LocalBlockchain get', port);
    return new JsonRpcProvider(`http://127.0.0.1:${port}/`);
  }
}
