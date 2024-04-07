import { Module, forwardRef } from '@nestjs/common';
import { UsersController as AdminUsersController } from '../controllers/admin-users.controller';
import { UsersService as AdminUsersService } from '../services/admin-users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { AuthService } from 'src/services/auth.service';
import { AuthController } from 'src/controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [AdminUsersController],
  providers: [AdminUsersService, AuthService],
  exports: [AdminUsersService],
})
export class UsersModule {}
