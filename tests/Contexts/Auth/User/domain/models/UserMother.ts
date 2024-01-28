import { BlockchainUser } from '../../../../../../src/Contexts/Auth/User/domain/models/BlockchainUser';
import { faker } from '@faker-js/faker';

export class UserMother {
  static create(address: string, message: string, token?: string, refreshToken?: string): BlockchainUser {
    return new BlockchainUser(address, message, token, refreshToken);
  }

  static random(address?: string, message?: string, token?: string, refreshToken?: string): BlockchainUser {
    return this.create(
      address ?? faker.helpers.fromRegExp(/(0x[a-f0-9]{40})/g),
      message ?? faker.lorem.sentence(),
      token ?? faker.string.alpha(10),
      refreshToken ?? faker.string.alpha(10)
    );
  }
}
