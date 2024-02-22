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
  discord: {
    token: {
      doc: 'Discord bot token',
      format: String,
      env: 'DISCORD_TOKEN',
      default: ''
    }
  },
  elastic: {
    url: {
      doc: 'The Elastic connection URL',
      format: String,
      env: 'ELASTIC_URL',
      default: 'http://localhost:9200'
    },
    indexName: {
      doc: 'The Elastic index name for this context',
      format: String,
      env: 'ELASTIC_INDEX_NAME',
      default: 'discord_messages'
    },
    config: {
      doc: 'The Elastic config for this context',
      format: '*',
      env: 'ELASTIC_CONFIG',
      default: {
        settings: {
          index: {
            number_of_replicas: 0 // for local development
          }
        },
        mappings: {
          properties: {
            id: {
              type: 'keyword',
              index: true
            },
            name: {
              type: 'text',
              index: true,
              fielddata: true
            },
            duration: {
              type: 'text',
              index: true,
              fielddata: true
            }
          }
        }
      }
    }
  }
});

config.loadFile([__dirname + '/default.json', __dirname + '/' + config.get('env') + '.json']);

export default config;
