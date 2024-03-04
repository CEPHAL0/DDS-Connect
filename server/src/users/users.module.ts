import { Module } from '@nestjs/common';
import { UsersController as AdminUsersController } from './controllers/admin/admin.controller';
import { UsersService as AdminUsersService } from './services/admin/admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entitites/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AdminUsersController],
  providers: [AdminUsersService],
})
export class UsersModule {}
