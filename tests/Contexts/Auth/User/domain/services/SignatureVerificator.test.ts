import { SignatureVerificator } from '../../../../../../src/Contexts/Auth/User/domain/services/SignatureVerificator';
import { Provider } from 'ethers';
import { instance, mock, when } from 'ts-mockito';

describe('SignatureVerificator', () => {
  it('should validate a signature', async () => {
    const provider = mock<Provider>();
    when(provider.getCode('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')).thenResolve('0x');
    const sut = new SignatureVerificator(instance(provider));
    await sut.verifyMessage(
      `\nunknown wants you to sign in with your Ethereum account:\n0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266\n\nSign in with ethereum to lens\n\nURI: unknown\nVersion: 1\nNetwork: goerli\nNonce: 00c6d1ac889f5ce6\nIssued At: 2023-07-31T13:26:56.962Z`,
      '0xfb2e55fa5e277bf60ca7d7374a8c836001bf1d5f3c334af117101e64bd30a9672a373a240e8ff65adc685676195fdbe035d28904504b267f040613de0f2c415e1b',
      '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
    );
  });

  it('should return a exception on invalidate a signature', async () => {
    const provider = mock<Provider>();
    when(provider.getCode('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')).thenResolve('0x');
    const sut = new SignatureVerificator(instance(provider));
    await expect(
      sut.verifyMessage(
        `\nunknown wants you to sign in with your Ethereum account:\n0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266\n\nSign in with ethereum to lens\n\nURI: unknown\nVersion: 1\nNetwork: goerli\nNonce: 00c6d1ac889f5ce6\nIssued At: 2023-07-31T13:26:56.962Z`,
        '0xfb3e55fa5e277bf60ca7d7374a8c836001bf1d5f3c334af117101e64bd30a9672a373a240e8ff65adc685676195fdbe035d28904504b267f040613de0f2c415e1b',
        '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
      )
    ).rejects.toThrowError('Signature not valid');
  });
});
