import {
  MongoClientFactory
} from '../../../../../../src/Contexts/Shared/infrastructure/persistence/mongo/MongoClientFactory';
import { StartedMongoDBContainer } from '@testcontainers/mongodb';

export class MongoClientMother {
  static async create() {
    return MongoClientFactory.createClient('shared', {
      url: 'mongodb://localhost:27017/test1'
    });
  }

  static async createFromContainer(container: Promise<StartedMongoDBContainer>, connectionName: string = 'test') {
    const mongoContainer = await container;
    return MongoClientFactory.createClient(connectionName, {
      url: `mongodb://${mongoContainer.getHost()}:${mongoContainer.getMappedPort(27017)}/test1?directConnection=true`
    });

  }
}
