import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './controllers/admin-users.controller';
import { UsersService } from './services/admin-users.service';
import { AuthModule } from './modules/auth.module';
import { FormsModule } from './modules/forms.module';
import { Form } from './entities/form.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [User, Form],

        // Set to false for production
        synchronize: true,
        retryDelay: 4,

        // autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    FormsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  private datasource: DataSource;
}
