export class SignatureVerificatorMock {
  constructor() {}

  async verifyMessage(_message: string, _signature: any, _ethereumAddress: string) {
    return;
  }
}
