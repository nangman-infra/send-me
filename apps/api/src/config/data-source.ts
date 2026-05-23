import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Letter } from '../modules/letters/letters.entity';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const sslEnabled = process.env.DB_SSL === 'true';

const CONNECTION_POOL_MAX = 10;
const CONNECTION_IDLE_TIMEOUT_MS = 30000;
const CONNECTION_ACQUIRE_TIMEOUT_MS = 3000;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  database: process.env.DB_NAME ?? 'future_letters',
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? '',
  entities: [Letter],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: !isProduction,
  ssl: sslEnabled ? { rejectUnauthorized: false } : false,
  extra: {
    max: CONNECTION_POOL_MAX,
    idleTimeoutMillis: CONNECTION_IDLE_TIMEOUT_MS,
    connectionTimeoutMillis: CONNECTION_ACQUIRE_TIMEOUT_MS,
  },
});
