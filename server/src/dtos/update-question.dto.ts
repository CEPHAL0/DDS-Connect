import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionDto } from './create-question.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateQuestionDto {
  @IsNotEmpty({ message: 'Question cannot be empty' })
  name: string;
}
