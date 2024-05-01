import {
  MongoClientFactory
} from '../../../../src/Contexts/Shared/infrastructure/persistence/mongo/MongoClientFactory';
import { MongoClient } from 'mongodb';
import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb';


describe('MongoClientFactory', () => {
  const mongoContainer = new MongoDBContainer().start();
  const factory = MongoClientFactory;
  let client: MongoClient;
  let container: StartedMongoDBContainer;
  beforeAll(async () => {
    container = await mongoContainer;
  });
  beforeEach(async () => {
    client = await factory.createClient('test', {
      url: `mongodb://${container.getHost()}:${container.getMappedPort(27017)}/test1?directConnection=true`
    });
  });

  afterEach(async () => {
    await client.close();
  });

  afterAll(async () => {
    await container.stop();
  });
  it('creates a new client with the connection already established', () => {
    expect(client).toBeInstanceOf(MongoClient);
  });

  it('creates a new client if it does not exist a client with the given name', async () => {

    const newClient = await factory.createClient('test2', {
      url: `mongodb://${container.getHost()}:${container.getMappedPort(27017)}/test2?directConnection=true`
    });

    expect(newClient).not.toBe(client);

    await newClient.close();
  });

  it('returns a client if it already exists', async () => {

    const newClient = await factory.createClient('test', {
      url: `mongodb://${container.getHost()}:${container.getMappedPort(27017)}/test3?directConnection=true`
    });

    expect(newClient).toBe(client);

    await newClient.close();
  });
});
