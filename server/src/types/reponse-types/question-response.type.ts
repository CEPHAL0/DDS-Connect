import { Question } from 'src/entities/question.entity';
import { ApiResponse } from './base-response.type';
import { Form } from 'src/entities/form.entity';

export type QuestionResponse = ApiResponse<Question>;

export type QuestionsResponse = ApiResponse<Question[]>;

export type QuestionsOfSingleForm = {
  questions: Question[];
  form: Form;
};

export type QuestionsForASingleFormResponse =
  ApiResponse<QuestionsOfSingleForm>;
