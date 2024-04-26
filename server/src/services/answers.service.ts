import { HttpException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from 'src/entities/answer.entity';
import { Response } from 'src/entities/response.entity';
import { Repository } from 'typeorm';
import { QuestionService } from './question.service';
import { QuestionResponse } from 'src/types/reponse-types/question-response.type';
import { AnswerResponse } from 'src/types/reponse-types/answer-response.type';

@Injectable()
export class AnswersService {
  @Inject(forwardRef(() => QuestionService))
  private questionService: QuestionService;

  public constructor(
    @InjectRepository(Response)
    private responseRepository: Repository<Response>,
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
  ) {}

  async fillAnswer(
    questionId: number,
    responseId: number,
    answer: string,
  ): Promise<AnswerResponse> {
    const response: Response = await this.responseRepository.findOne({
      where: { id: responseId },
    });

    const questionResponse: QuestionResponse =
      await this.questionService.findOneById(questionId);

    const question = questionResponse.data;

    console.log(question);

    if (question.type == 'Multiple') {
      const values = question.values;

      if (values.length < 1) {
        throw new HttpException('Question doesnot have values', 400);
      }

      let matchFound: boolean = false;
      for (const value of values) {
        if (value.name === answer) {
          const savedAnswer: Answer = await this.answerRepository.save({
            answer: value.name,
            question_value: question.name,
            response: response,
            question: question,
          });
          matchFound = true;

          const answerResponse: AnswerResponse = {
            data: savedAnswer,
            message: 'Saved answer successfully',
            statusCode: 200,
          };

          return answerResponse;
        }
      }

      if (!matchFound) {
        throw new HttpException('Value doesnot match options', 400);
      }
    } else {
      const savedAnswer: Answer = await this.answerRepository
        .save({
          answer: answer,
          question: question,
          question_value: question.name,
          response: response,
        })
        .catch((error) => {
          throw new HttpException('Failed to save answer', 400);
        });

      const answerResponse: AnswerResponse = {
        data: savedAnswer,
        message: 'Saved answer successfully',
        statusCode: 200,
      };

      return answerResponse;
    }
  }
}
