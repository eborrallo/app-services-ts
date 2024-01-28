import { ethers, hashMessage, id, Provider } from 'ethers';

export class SignatureVerificator {
  private eip1271ABI = [
    'function isValidSignature(bytes32 _message, bytes _signature) public view returns (bytes4 magicValue)'
  ];
  private eip1271MagicLink = id('isValidSignature(bytes32,bytes)');
  private EMPTY_BYTE = '0x';

  constructor(private ethersProvider: Provider) {}

  async verifyMessage(message: string, signature: any, ethereumAddress: string) {
    const code = await this.ethersProvider.getCode(ethereumAddress);
    let valid;
    if (code === this.EMPTY_BYTE) {
      // normal wallet
      const signedAddress = ethers.verifyMessage(message, signature);
      valid = signedAddress.toLowerCase() === ethereumAddress.toLowerCase();
    } else {
      // smart contract wallet
      const contractWallet = new ethers.Contract(ethereumAddress, this.eip1271ABI, this.ethersProvider);
      const hash = hashMessage(message);

      try {
        const returnValue = await contractWallet.isValidSignature(hash, signature);
        valid = returnValue === this.eip1271MagicLink;
      } catch (error) {
        // signature is not valid
        valid = false;
      }
    }
    if (!valid) {
      throw Error('Signature not valid');
    }
  }
}
