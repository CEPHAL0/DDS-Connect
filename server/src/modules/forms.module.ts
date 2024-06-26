import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormsController } from 'src/controllers/forms.controller';
import { Form } from 'src/entities/form.entity';
import { UsersService } from 'src/services/admin-users.service';
import { FormService } from 'src/services/forms.service';
import { UsersModule } from './users.module';
import { AuthModule } from './auth.module';
import { QuestionsModule } from './questions.module';
import { Response } from 'src/entities/response.entity';
import { AnswersService } from 'src/services/answers.service';
import { AnswersModule } from './answer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Form, Response]),
    UsersModule,
    AuthModule,
    forwardRef(() => QuestionsModule),
    forwardRef(() => AnswersModule),
    // AnswersModule,
  ],
  controllers: [FormsController],
  providers: [FormService],
  exports: [FormService],
})
export class FormsModule {}
