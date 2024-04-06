import { IsEnum, IsNotEmpty } from 'class-validator';
import { QuestionType } from 'src/types/question-type.enum';

export class CreateQuestionDto {
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @IsNotEmpty({ message: 'Type cannot be empty' })
  @IsEnum(QuestionType, {
    message:
      'Question Type must be one of the following: Single, Multiple, Date, YesNo',
  })
  type: QuestionType;

  values: Array<string>;
}
