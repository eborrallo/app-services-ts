import { faker } from '@faker-js/faker';
import {Faker} from "@faker-js/faker/faker";

export class MotherCreator {
  static random(): Faker {
    return faker;
  }
}
