import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Warn } from './entities/Warn';
import { Ban } from './entities/Ban';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'discord_bot',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Warn, Ban],
  migrations: ['src/database/migrations/*.ts'],
});