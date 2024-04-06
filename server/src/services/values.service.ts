import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Value } from 'src/entities/values.entity';
import { DataSource, Repository } from 'typeorm';
import { QuestionService } from './question.service';
import { ValuesResponse } from 'src/types/reponse-types/value-response.type';
import { QuestionResponse } from 'src/types/reponse-types/question-response.type';
import { ApiResponse } from 'src/types/reponse-types/base-response.type';
import { Question } from 'src/entities/question.entity';

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

  async createOneValueForAQuestion(
    questionId: number,
    name: string,
  ): Promise<ApiResponse<null>> {
    const questionResponse: QuestionResponse =
      await this.questionService.findOneById(questionId);

    const question: Question = questionResponse.data;

    await this.valueRepository
      .save({ name: name, question: question })
      .catch((error) => {
        throw new HttpException('Failed to save value', 400);
      });

    const valueResponse: ApiResponse<null> = {
      data: null,
      message: 'Added value to question successfully',
      statusCode: 200,
    };

    return valueResponse;
  }

  async updateOneValue(
    valueId: number,
    name: string,
  ): Promise<ApiResponse<null>> {
    const value: Value = await this.valueRepository
      .findOneOrFail({
        where: { id: valueId },
      })
      .catch((error) => {
        throw new NotFoundException('Value not found');
      });

    await this.valueRepository.update(value.id, { name: name });

    const valueResponse: ApiResponse<null> = {
      data: null,
      message: 'Updated value successfully',
      statusCode: 200,
    };

    return valueResponse;
  }

  async deleteOneValue(valueId: number): Promise<ApiResponse<null>> {
    const value = await this.valueRepository
      .findOneOrFail({
        where: { id: valueId },
      })
      .catch((error) => {
        throw new HttpException('Value not found', 404);
      });

    await this.valueRepository.delete(value.id);

    const valueResponse: ApiResponse<null> = {
      data: null,
      message: 'Deleted value successfully',
      statusCode: 200,
    };

    return valueResponse;
  }
}
