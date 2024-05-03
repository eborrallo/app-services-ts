import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';

export class TestContainersMother {
  static async blockchain(): Promise<StartedTestContainer> {

    const container = await new GenericContainer('ethereumoptimism/hardhat:latest')
      .withExposedPorts(8545)
      //  .withWaitStrategy(Wait.forLogMessage('Listening on 127.0.0.1:8545'))
      .withWaitStrategy(Wait.forListeningPorts())
      .withStartupTimeout(20_000)
      .start();

    return container;
  }

  static async postgres(config: any): Promise<StartedPostgreSqlContainer> {
    const container = await new PostgreSqlContainer().start();
    config.set('typeorm', {
      host: container.getHost(),
      port: container.getMappedPort(5432),
      username: container.getUsername(),
      password: container.getPassword(),
      database: container.getDatabase()
    });

    return container;

  }

  static async mongo(config: any): Promise<StartedTestContainer> {
    const container = await new GenericContainer('mongo:5.0.0')
      .withExposedPorts(27017)
      .withWaitStrategy(Wait.forListeningPorts())
      .withStartupTimeout(60_000)
      .start();
    config.set('mongo.url', `mongodb://localhost:${container.getMappedPort(27017)}/test`);

    return container;
  }

  static async rabbitMQ(config: any): Promise<StartedTestContainer> {
    const container = await new GenericContainer('rabbitmq:3.8')
      .withExposedPorts(5672)
      .withWaitStrategy(Wait.forLogMessage('started TCP listener on [::]:5672'))
      .withStartupTimeout(60_000)
      .start();

    config.set('rabbitmq.connectionSettings.connection.port', container.getMappedPort(5672));
    return container;
  }

  static async s3(config: any): Promise<StartedTestContainer> {

    const build = await GenericContainer.fromDockerfile(__dirname + '/s3-storage').build();
    const container = await build.withExposedPorts(8000)
      .withName('s3.docker.test')
      .withEnvironment({
        'ENDPOINT': 'http://127.0.0.1:8000',
        'LISTEN_ADDR': '0.0.0.0',
        'S3BACKEND': 'mem'
      })
      .withWaitStrategy(
        Wait.forAll([
          Wait.forListeningPorts(),
          Wait.forLogMessage('*** Bucket created.')
        ])
      )
      .start();

    config.set('s3.endpoint', `http://127.0.0.1:${container.getMappedPort(8000)}`);
    return container;
  }
}
