import { Module } from '@nestjs/common';
import { UsersController as AdminUsersController } from '../controllers/admin-users.controller';
import { UsersService as AdminUsersService } from '../providers/admin-users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { AuthService } from 'src/providers/auth.service';
import { AuthController } from 'src/controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule],
  controllers: [AdminUsersController],
  providers: [AdminUsersService, AuthService],
  exports: [AdminUsersService],
})
export class UsersModule {}
