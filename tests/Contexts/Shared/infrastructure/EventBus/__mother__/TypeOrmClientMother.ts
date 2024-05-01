import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import {
  TypeOrmClientFactory
} from '../../../../../../src/Contexts/Shared/infrastructure/persistence/typeorm/TypeOrmClientFactory';

export class TypeOrmClientMother {

  static async createFromContainer(container: Promise<StartedPostgreSqlContainer>, connectionName: string = 'test') {
    const postgreSqlContainer = await container;
    return TypeOrmClientFactory.createClient(connectionName, {
      host: '127.0.0.1',
      port: postgreSqlContainer.getMappedPort(5432),
      username: postgreSqlContainer.getUsername(),
      password: postgreSqlContainer.getPassword(),
      database: postgreSqlContainer.getDatabase()
    });

  }
}
