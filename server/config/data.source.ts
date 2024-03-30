// dbdatasource.ts
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

export const getDataSourceOptions = (
  configService: ConfigService,
): DataSourceOptions => ({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: +configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USER'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  synchronize: true,
  entities: ['../src/entities/*.entity.ts'],
  migrations: ['./migrations/*.ts'],
  migrationsTableName: 'task_migrations',
});

export const createDataSource = (configService: ConfigService): DataSource => {
  const dataSourceOptions = getDataSourceOptions(configService);

  return new DataSource(dataSourceOptions);
};

const myConfigService: ConfigService = new ConfigService();

const dataSource = createDataSource(myConfigService);

export default dataSource;
