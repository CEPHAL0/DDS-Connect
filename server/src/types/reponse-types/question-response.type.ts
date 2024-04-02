import { Question } from 'src/entities/question.entity';
import { ApiReponse } from './base-response.type';

export type QuestionResponse = ApiReponse<Question>;

export type QuestionsResponse = ApiReponse<Question[]>;
