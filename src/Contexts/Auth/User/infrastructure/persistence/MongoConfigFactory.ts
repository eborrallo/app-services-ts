import MongoConfig from '../../../../Shared/infrastructure/persistence/mongo/MongoConfig';
import config from '../config';

export class MongoConfigFactory {
  static createConfig(c?: any): MongoConfig {
    return {
      url: c ?? config.get('mongo.url')
    };
  }
}
