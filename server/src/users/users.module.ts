import { Module } from '@nestjs/common';
import { UsersController as AdminUsersController } from './controllers/admin.controller';
import { UsersService as AdminUsersService } from './services/admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entitites/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { AuthController } from 'src/auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule],
  controllers: [AdminUsersController],
  providers: [AdminUsersService, AuthService],
  exports: [AdminUsersService],
})
export class UsersModule {}
