import { Connection, DataSource } from 'typeorm';
import {
  TypeOrmClientFactory
} from '../../../../src/Contexts/Shared/infrastructure/persistence/typeorm/TypeOrmClientFactory';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';

const postgresContainer = new PostgreSqlContainer().start();

describe('TypeOrmClientFactory', () => {
  const factory = TypeOrmClientFactory;
  let client: Connection;
  let container: StartedPostgreSqlContainer;
  let config: any;
  beforeAll(async () => {
    container = await postgresContainer;
    config = {
      host: '127.0.0.1',
      port: container.getMappedPort(5432),
      username: container.getUsername(),
      password: container.getPassword(),
      database: container.getDatabase()
    };
  });
  afterAll(async () => {
    await container.stop();
  });
  beforeEach(async () => {
    client = await factory.createClient('test', config);
  });

  afterEach(async () => {
    await client.close();
  });

  it('creates a new client with the connection already established', () => {
    expect(client).toBeInstanceOf(DataSource);
    expect(client.isConnected).toBe(true);
  });

  it('creates a new client if it does not exist a client with the given name', async () => {
    const newClient = await factory.createClient('test2', config);

    expect(newClient).not.toBe(client);
    expect(newClient.isConnected).toBeTruthy();

    await newClient.close();
  });

  it('returns a client if it already exists', async () => {
    const newClient = await factory.createClient('test', config);

    expect(newClient).toBe(client);
    expect(newClient.isConnected).toBeTruthy();
  });
});
