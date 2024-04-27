import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthModule } from './modules/auth.module';
import { FormsModule } from './modules/forms.module';
import { DatabaseConfig } from './config';
import { QuestionsModule } from './modules/questions.module';
import { ValueModule } from './modules/values.module';
import { AnswersModule } from './modules/answer.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [DatabaseConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    FormsModule,
    QuestionsModule,
    ValueModule,
    AnswersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  private datasource: DataSource;
}
