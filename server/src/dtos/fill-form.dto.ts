import { IsNotEmpty } from 'class-validator';

export class QuestionAnswerDto {
  @IsNotEmpty({ message: 'Question cannot be empty' })
  questionId: number;

  @IsNotEmpty({ message: 'Answer cannot be empty' })
  answer: string;
}
