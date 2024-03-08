import { Module } from '@nestjs/common';
import { UsersController as AdminUsersController } from './controllers/admin-users.controller';
import { UsersService as AdminUsersService } from './services/admin-users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entitites/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { AuthController } from 'src/auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { Form } from 'src/forms/entities/form.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule],
  controllers: [AdminUsersController],
  providers: [AdminUsersService, AuthService],
  exports: [AdminUsersService],
})
export class UsersModule {}
