import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Value } from 'src/entities/values.entity';
import { FormsModule } from './forms.module';
import { QuestionService } from 'src/services/question.service';
import { ValueService } from 'src/services/values.service';
import { QuestionsModule } from './questions.module';
import { ValuesController } from 'src/controllers/values.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Value]),
    forwardRef(() => QuestionsModule),
  ],
  providers: [ValueService],
  exports: [ValueService],
  controllers: [ValuesController],
})
export class ValueModule {}
