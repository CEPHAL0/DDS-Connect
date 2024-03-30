import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [`../entities/*.entity.ts`],
  synchronize: false,
  migrations: ['../../database/migrations/*.migration.ts'],
  migrationsTableName: 'migrations',
}));
