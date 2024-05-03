import { TypeOrmConfig } from '../../../../Shared/infrastructure/persistence/typeorm/TypeOrmConfig';
import config from '../config';

export class TypeOrmConfigFactory {
  static createConfig(c?: any): TypeOrmConfig {
    const configTypeOrm = c ?? config.get('typeorm');
    console.log({
      host: configTypeOrm.host,
      port: configTypeOrm.port,
      username: configTypeOrm.username,
      password: configTypeOrm.password,
      database: configTypeOrm.database
    })
    return {
      host: configTypeOrm.host,
      port: configTypeOrm.port,
      username: configTypeOrm.username,
      password: configTypeOrm.password,
      database: configTypeOrm.database
    };
  }
}
