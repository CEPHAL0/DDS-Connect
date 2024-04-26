import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { configDotenv } from 'dotenv';

configDotenv();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST'),
  port: +configService.get('DATABASE_PORT'),
  username: configService.get('DATABASE_USER'),
  password: configService.get('DATABASE_PASSWORD'),
  database: configService.get('DATABASE_NAME'),
  entities: [`${__dirname}/../src/**/*.entity{.ts,.js}`],
  synchronize: true,
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
});
