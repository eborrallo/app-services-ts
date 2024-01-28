import { JwtGenerator } from '../../../../../../src/Contexts/Auth/User/domain/services/JwtGenerator';

describe('JwtGenerator', () => {
  it('generate a valid JWT', async () => {
    const sut = new JwtGenerator();
    const jwt = sut.generate('aa');
    expect(sut.decode(jwt)).toMatchObject({ address: 'aa' });
  });
});
