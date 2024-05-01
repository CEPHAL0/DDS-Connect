import { HttpException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from 'src/entities/answer.entity';
import { Response } from 'src/entities/response.entity';
import { DataSource, Repository } from 'typeorm';
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

    private dataSource: DataSource,
  ) {}

  async fillAnswer(
    questionId: number,
    responseId: number,
    answer: string | Array<string>,
  ): Promise<AnswerResponse> {
    const response: Response = await this.responseRepository.findOne({
      where: { id: responseId },
    });

    const questionResponse: QuestionResponse =
      await this.questionService.findOneById(questionId);

    const question = questionResponse.data;

    if (question.type == 'Multiple') {
      const values = question.values;

      if (values.length < 1) {
        throw new HttpException('Question doesnot have values', 400);
      }

      let matchFound: boolean = false;

      for (const value of values) {
        for (const oneAnswer of answer) {
          if (oneAnswer === value.name) {
            matchFound = true;
          }
        }
      }

      if (!matchFound) {
        throw new HttpException('Value doesnot match options', 400);
      }

      var answerToSave: string;
      if (Array.isArray(answer)) {
        answerToSave = answer.join(',');
      } else {
        answerToSave = answer;
      }
      const savedAnswer: Answer = await this.answerRepository.save({
        answer: answerToSave,
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
    } else {
      if (Array.isArray(answer)) {
        throw new HttpException(
          'Cannot save multiple values for Single type answer',
          400,
        );
      }

      var matchFound: boolean = false;
      const values = question.values;

      if (values.length > 0) {
        for (const value of values) {
          if (answer === value.name) {
            matchFound = true;
          }
        }
      }

      if (!matchFound) {
        throw new HttpException('Answer doesnot match value options', 400);
      }

      const savedAnswer: Answer = await this.answerRepository
        .save({
          answer: answer,
          question: question,
          question_value: question.name,
          response: response,
        })
        .catch((error) => {
          console.log(error.message);
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
