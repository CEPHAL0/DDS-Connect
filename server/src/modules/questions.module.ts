import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from 'src/entities/question.entity';
import { AuthModule } from './auth.module';
import { UsersModule } from './users.module';
import { QuestionsController } from 'src/controllers/questions.controller';
import { QuestionService } from 'src/services/question.service';
import { FormsModule } from './forms.module';
import { FormService } from 'src/services/forms.service';
import { ValueModule } from './values.module';
import { ValueService } from 'src/services/values.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question]),
    AuthModule,
    UsersModule,
    forwardRef(() => FormsModule),
    forwardRef(() => ValueModule),
  ],
  controllers: [QuestionsController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionsModule {}
