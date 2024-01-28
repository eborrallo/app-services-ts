import * as dotenv from 'dotenv';
import convict from 'convict';

dotenv.config();

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'staging', 'test'],
    default: 'default',
    env: 'NODE_ENV'
  },
  network: {
    doc: 'Ethereum network',
    format: ['goerli', 'mainnet', 'sepolia'],
    default: 'sepolia',
    env: 'NETWORK'
  },
  jwtSecret: {
    doc: 'JWT Secret',
    format: String,
    default: '123123',
    env: 'JWT_SECRET'
  },
  alchemyKey: {
    doc: 'Alchemy API Key',
    format: String,
    default: 'none',
    env: 'ALCHEMY_KEY'
  },
  mongo: {
    url: {
      doc: 'The Mongo connection URL',
      format: String,
      env: 'MONGO_URL',
      default: 'mongodb://localhost:27017/auth-dev'
    }
  },
  firebase: {
    type: {format: String,env:'FIREBASE_TYPE', default: ''},
    project_id: {format: String,env:'FIREBASE_PROJECT_ID', default: ''},
    private_key_id: {format: String,env:'FIREBASE_PRIVATE_KEY_ID', default: ''},
    private_key: {format: String,env:'FIREBASE_PRIVATE_KEY', default: ''},
    client_email: {format: String,env:'FIREBASE_CLIENT_EMAIL', default: ''},
    client_id: {format: String,env:'FIREBASE_CLIENT_ID', default: ''},
    auth_uri: {format: String,env:'FIREBASE_AUTH_URI', default: ''},
    token_uri: {format: String,env:'FIREBASE_TOKEN_URI', default: ''},
    auth_provider_x509_cert_url: {format: String,env:'FIREBASE_AUTH_PROVIDER_X509_CERT_URL', default: ''},
    client_x509_cert_url: {format: String,env:'FIREBASE_CLIENT_X509_CERT_URL', default: ''}
  },
  typeorm: {
    host: {
      doc: 'The database host',
      format: String,
      env: 'TYPEORM_HOST',
      default: 'localhost'
    },
    port: {
      doc: 'The database port',
      format: Number,
      env: 'TYPEORM_PORT',
      default: 5432
    },
    username: {
      doc: 'The database username',
      format: String,
      env: 'TYPEORM_USERNAME',
      default: 'user'
    },
    password: {
      doc: 'The database password',
      format: String,
      env: 'TYPEORM_PASSWORD',
      default: 'password'
    },
    database: {
      doc: 'The database name',
      format: String,
      env: 'TYPEORM_DATABASE',
      default: 'auth'
    }
  },
  rabbitmq: {
    connectionSettings: {
      username: {
        doc: 'RabbitMQ username',
        format: String,
        env: 'RABBITMQ_USERNAME',
        default: 'guest'
      },
      password: {
        doc: 'RabbitMQ password',
        format: String,
        env: 'RABBITMQ_PASSWORD',
        default: 'guest'
      },
      vhost: {
        doc: 'RabbitMQ virtual host',
        format: String,
        env: 'RABBITMQ_VHOST',
        default: '/'
      },
      connection: {
        secure: {
          doc: 'RabbitMQ secure protocol',
          format: Boolean,
          env: 'RABBITMQ_SECURE',
          default: false
        },
        hostname: {
          doc: 'RabbitMQ hostname',
          format: String,
          env: 'RABBITMQ_HOSTNAME',
          default: 'localhost'
        },
        port: {
          doc: 'RabbitMQ amqp port',
          format: Number,
          env: 'RABBITMQ_PORT',
          default: 5672
        }
      }
    },
    exchangeSettings: {
      name: {
        doc: 'RabbitMQ exchange name',
        format: String,
        env: 'RABBITMQ_EXCHANGE_NAME',
        default: 'domain_events'
      }
    },
    maxRetries: {
      doc: 'Max number of retries for each message',
      format: Number,
      env: 'RABBITMQ_MAX_RETRIES',
      default: 3
    },
    retryTtl: {
      doc: 'Ttl for messages in the retry queue',
      format: Number,
      env: 'RABBITMQ_RETRY_TTL',
      default: 1000
    }
  }
});

config.loadFile([__dirname + '/default.json', __dirname + '/' + config.get('env') + '.json']);

export default config;
