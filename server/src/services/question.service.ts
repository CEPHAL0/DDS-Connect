import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { FormService } from './forms.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/entities/question.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateQuestionDto } from 'src/dtos/create-question.dto';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { User } from 'src/entities/user.entity';
import { Form } from 'src/entities/form.entity';
import { FormReponse } from 'src/types/reponse-types/form-reponse';
import {
  QuestionResponse,
  QuestionsResponse,
} from 'src/types/reponse-types/question-response.type';
import { ValueService } from './values.service';
import { ValuesResponse } from 'src/types/reponse-types/value-response.type';
import { QuestionType } from 'src/types/question-type.enum';

@Injectable()
export class QuestionService {
  @Inject(forwardRef(() => ValueService))
  private valueService: ValueService;

  public constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,

    private formService: FormService,

    private dataSource: DataSource,
  ) {}

  async createOneQuestion(
    request: Request,
    createQuestionDto: CreateQuestionDto,
    formId: number,
  ): Promise<QuestionResponse> {
    const queryRunner = await this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const formBelongsToUser = await this.formService.getFormBelongsToUser(
        request,
        formId,
      );

      if (!formBelongsToUser) {
        throw new UnauthorizedException('Form doesnot belong to user');
      }

      const formResponse: FormReponse =
        await this.formService.findOneById(formId);

      const form: Form = formResponse.data;

      const data = { ...createQuestionDto, form: { ...form } };

      const { values, ...question } = data;

      const savedQuestion: Question = await this.questionRepository
        .save(question)
        .catch((error: Error) => {
          console.log(error);
          throw new HttpException('Failed to save question', 400);
        });

      if (createQuestionDto.type == QuestionType.multiple) {
        const valuesResponse: ValuesResponse =
          await this.valueService.storeValuesForAQuestion(
            values,
            savedQuestion.id,
          );
      }

      const questionResponse: QuestionResponse = {
        data: null,
        message: 'Saved Question Successfully',
        statusCode: 200,
      };

      return questionResponse;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException('Failed to save question', 400);
    } finally {
      await queryRunner.release();
    }
  }

  async getAllQuestions() {
    const questions: Question[] = await this.questionRepository.find({
      relations: { form: true, values: true },
    });

    const questionsResponse: QuestionsResponse = {
      data: questions,
      message: 'Retrieved questions successfully',
      statusCode: 200,
    };

    return questionsResponse;
  }

  async findOneById(id: number): Promise<QuestionResponse> {
    const question: Question = await this.questionRepository
      .findOneByOrFail({
        id,
      })
      .catch((error) => {
        throw new HttpException('Question Not Found', 404);
      });

    const questionResponse: QuestionResponse = {
      data: question,
      message: 'Question retrieved successfully',
      statusCode: 200,
    };

    return questionResponse;
  }

  async getAllQuestionsForForm(formId: number) {
  }

  async createMultipleQuestionsForForm() {}

  async updateOneQuestion() {}

  async updateMultipleQuestionsForForm() {}

  async deleteOneQuestionFromForm() {}

  async deleteAllQuestionsFromForm() {}
}
