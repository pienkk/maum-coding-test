import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const pgDataSource = new DataSource({
  type: 'postgres',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: +process.env.DB_PORT,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  synchronize: false,
  entities: ['dist/**/*.entity.js'],
  migrations: ['migrations/*.ts'],
});
