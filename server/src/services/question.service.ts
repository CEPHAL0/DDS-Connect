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
  QuestionsForASingleFormResponse,
  QuestionsResponse,
} from 'src/types/reponse-types/question-response.type';
import { ValueService } from './values.service';
import { ValuesResponse } from 'src/types/reponse-types/value-response.type';
import { QuestionType } from 'src/types/question-type.enum';
import { ApiResponse } from 'src/types/reponse-types/base-response.type';
import { UpdateQuestionDto } from 'src/dtos/update-question.dto';

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

  async getAllQuestionsForAForm(
    formId: number,
  ): Promise<QuestionsForASingleFormResponse> {
    const questions: Question[] = await this.questionRepository.find({
      relations: { values: true },
      where: {
        form: {
          id: formId,
        },
      },
    });

    const formResponse: FormReponse =
      await this.formService.findOneById(formId);

    const form: Form = formResponse.data;

    delete form.questions;

    const questionsForASingleFormResponse: QuestionsForASingleFormResponse = {
      data: { form: form, questions: questions },
      message: 'Retrieved questions for given form successfully',
      statusCode: 200,
    };

    return questionsForASingleFormResponse;
  }

  async createMultipleQuestionsForForm(
    formId: number,
    createQuestionsDto: CreateQuestionDto[],
  ) {
    const formResponse: FormReponse =
      await this.formService.findOneById(formId);

    const form: Form = formResponse.data;

    for (const createQuestionDto of createQuestionsDto) {
      const { values, ...question } = createQuestionDto;

      const savedQuestion: Question = await this.questionRepository.save({
        ...question,
        form: form,
      });
      if (question.type == QuestionType.multiple) {
        const valueResponse = await this.valueService.storeValuesForAQuestion(
          values,
          savedQuestion.id,
        );
      }
    }

    const response: ApiResponse<null> = {
      data: null,
      message: 'Saved Questions for a form successfully',
      statusCode: 200,
    };

    return response;
  }

  async updateOneQuestion(
    request: Request,
    questionId: number,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<QuestionResponse> {
    const question = await this.questionRepository
      .findOneOrFail({
        relations: { values: true, form: true },
        where: { id: questionId },
      })
      .catch((error) => {
        throw new HttpException('Question not found', 404);
      });

    const formId = question.form.id;

    const formBelongsToUser = await this.formService.getFormBelongsToUser(
      request,
      formId,
    );

    if (!formBelongsToUser) {
      throw new UnauthorizedException('Form Doesnot belong to user');
    }

    await this.questionRepository
      .update(questionId, updateQuestionDto)
      .catch((error) => {
        throw new HttpException('Failed to update question', 400);
      });

    const questionResponse: QuestionResponse = {
      data: null,
      message: 'Successfully updated the question',
      statusCode: 200,
    };

    return questionResponse;
  }

  async updateMultipleQuestionsForForm() {}

  async deleteOneQuestionFromForm(request: Request, questionId: number) {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
      relations: { form: true },
    });

    const formBelongsToUser: boolean =
      await this.formService.getFormBelongsToUser(request, question.form.id);

    if (!formBelongsToUser) {
      throw new UnauthorizedException('Form doesnot belong to user');
    }

    await this.questionRepository.delete(questionId);

    const questionResponse: QuestionResponse = {
      data: null,
      message: 'Question deleted successfully',
      statusCode: 200,
    };

    return questionResponse;
  }

  async deleteAllQuestionsFromForm() {}
}
