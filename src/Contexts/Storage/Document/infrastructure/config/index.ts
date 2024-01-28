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
  mongo: {
    url: {
      doc: 'The Mongo connection URL',
      format: String,
      env: 'MONGO_URL',
      default: 'mongodb://localhost:27017/storage-dev'
    }
  },
  s3: {
    sslEnabled: {
      doc: 'S3 ssl enabled',
      format: String,
      env: 'S3_SSL_ENABLED',
      default: 'false'
    },
    endpoint: {
      doc: 'S3 endpoint',
      format: String,
      env: 'S3_ENDPOINT',
      default: 'http://localhost:8000'
    },
    signatureCache: {
      doc: 'S3 signature cache',
      format: String,
      env: 'S3_SIGNATURE_CACHE',
      default: 'false'
    },
    signatureVersion: {
      doc: 'S3 signature version',
      format: String,
      env: 'S3_SIGNATURE_VERSION',
      default: 'v4'
    },
    region: {
      doc: 'S3 region',
      format: String,
      env: 'S3_REGION',
      default: 'us-east-1'
    },
    forcePathStyle: {
      doc: 'S3 force path style',
      format: String,
      env: 'S3_FORCE_PATH_STYLE',
      default: 'true'
    },
    accessKeyId: {
      doc: 'S3 access key id',
      format: String,
      env: 'S3_ACCESS_KEY',
      default: 'accessKey1'
    },
    secretAccessKey: {
      doc: 'S3 secret access key',
      format: String,
      env: 'S3_SECRET_KEY',
      default: 'verySecretKey1'
    },
    bucketPrefix: {
      doc: 'S3 bucket prefix',
      format: String,
      env: 'S3_BUCKET_PREFIX',
      default: ''
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
