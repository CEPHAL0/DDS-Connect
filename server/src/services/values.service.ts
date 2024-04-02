import { HttpException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Value } from 'src/entities/values.entity';
import { FormReponse } from 'src/types/reponse-types/form-reponse';
import { DataSource, Repository } from 'typeorm';
import { FormService } from './forms.service';
import { Form } from 'src/entities/form.entity';
import { QuestionService } from './question.service';
import {
  ValueResponse,
  ValuesResponse,
} from 'src/types/reponse-types/value-response.type';
import { Question } from 'src/entities/question.entity';
import { QuestionResponse } from 'src/types/reponse-types/question-response.type';

@Injectable()
export class ValueService {
  @Inject(forwardRef(() => QuestionService))
  private questionService: QuestionService;

  public constructor(
    @InjectRepository(Value)
    private valueRepository: Repository<Value>,

    private dataSource: DataSource,
  ) {}

  async storeValuesForAQuestion(
    values: string[],
    questionId: number,
  ): Promise<ValuesResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const savedValues = [];

    try {
      for (const value of values) {
        const questionResponse: QuestionResponse =
          await this.questionService.findOneById(questionId);

        const question = questionResponse.data;

        const savedValue: Value = await this.valueRepository
          .save({
            name: value,
            question: question,
          })
          .catch((error: Error) => {
            throw new Error('Failed to save values');
          });

        savedValues.push(savedValue);
      }

      const valuesResponse: ValuesResponse = {
        data: savedValues,
        message: 'Values Saved Successfully',
        statusCode: 200,
      };

      await queryRunner.commitTransaction();
      return valuesResponse;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      throw new HttpException('Failed to save values', 400);
    } finally {
      await queryRunner.release();
    }
  }
}
