import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormsController } from 'src/controllers/forms.controller';
import { Form } from 'src/entities/form.entity';
import { UsersService } from 'src/services/admin-users.service';
import { FormService } from 'src/services/forms.service';
import { UsersModule } from './users.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Form]), UsersModule, AuthModule],
  controllers: [FormsController],
  providers: [FormService],
  exports: [FormService],
})
export class FormsModule {}
