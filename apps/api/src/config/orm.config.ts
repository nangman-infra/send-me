import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Letter } from '../modules/letters/letters.entity';

const CONNECTION_POOL_MAX = 10;
const CONNECTION_IDLE_TIMEOUT_MS = 30000;
const CONNECTION_ACQUIRE_TIMEOUT_MS = 3000;

export function createOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  const sslEnabled = configService.get<string>('DB_SSL') === 'true';

  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    database: configService.get<string>('DB_NAME', 'future_letters'),
    username: configService.get<string>('DB_USER', 'postgres'),
    password: configService.get<string>('DB_PASSWORD', ''),
    entities: [Letter],
    migrations: ['dist/migrations/*.js'],
    synchronize: !isProduction,
    logging: !isProduction,
    ssl: sslEnabled ? { rejectUnauthorized: false } : false,
    extra: {
      max: CONNECTION_POOL_MAX,
      idleTimeoutMillis: CONNECTION_IDLE_TIMEOUT_MS,
      connectionTimeoutMillis: CONNECTION_ACQUIRE_TIMEOUT_MS,
    },
  };
}
