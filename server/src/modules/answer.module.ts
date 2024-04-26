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
import { Question } from 'src/entities/question.entity';
import { Answer } from 'src/entities/answer.entity';
import { AnswersService } from 'src/services/answers.service';
import { AnswersController } from 'src/controllers/answers.controller';
import { FormsModule } from './forms.module';
import { Response } from 'src/entities/response.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Answer, Response]),
    UsersModule,
    AuthModule,
    forwardRef(() => QuestionsModule),
    forwardRef(() => FormsModule),
    // FormsModule,
  ],
  controllers: [],
  providers: [AnswersService],
  exports: [AnswersService],
})
export class AnswersModule {}
