import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFormDto } from 'src/dtos/create-form.dto';
import { Form } from 'src/entities/form.entity';
import { User } from 'src/entities/user.entity';
import { FormStatus } from 'src/types/form-status.enum';
import {
  FormResponse,
  FormsReponse,
} from 'src/types/reponse-types/form-reponse';
import { DataSource, QueryRunner, Repository } from 'typeorm';

import { Request } from 'express';

import { UpdateFormDto } from 'src/dtos/update-form.dto';
import { AuthService } from './auth.service';
import { Role } from 'src/types/role.enum';
import { QuestionAnswerDto } from 'src/dtos/fill-form.dto';
import { Question } from 'src/entities/question.entity';
import { QuestionService } from './question.service';
import { QuestionResponse } from 'src/types/reponse-types/question-response.type';
import { Response } from 'src/entities/response.entity';
import { AnswersService } from './answers.service';
import { ApiResponse } from 'src/types/reponse-types/base-response.type';

@Injectable()
export class FormService {
  @Inject(forwardRef(() => QuestionService))
  private questionService: QuestionService;

  @Inject(forwardRef(() => AnswersService))
  private answersService: AnswersService;

  public constructor(
    @InjectRepository(Form)
    private formRepository: Repository<Form>,

    @InjectRepository(Response)
    private responseRepository: Repository<Response>,
    private authService: AuthService,
    private dataSource: DataSource,
  ) {}

  async findAll(): Promise<FormsReponse> {
    const forms: Form[] = await this.formRepository.find({
      relations: ['questions', 'questions.values', 'created_by'],
    });

    forms.forEach((form) => {
      delete form.created_by.password;
    });

    const response: FormsReponse = {
      data: forms,
      message: 'Forms fetched successfully',
      statusCode: 200,
    };

    return response;
  }

  async createForm(
    request: Request,
    createFormDto: CreateFormDto,
  ): Promise<FormResponse> {
    const status = FormStatus.open;

    const user: User = await this.authService.getUserFromCookie(request);

    const data = { ...createFormDto, status: status, created_by: user };

    await this.formRepository.save(data).catch((e) => {
      console.log(e.message);
      throw new HttpException('Failed to create form', 400);
    });

    const formResponse: FormResponse = {
      data: null,
      message: 'Form Created Successfully',
      statusCode: 200,
    };

    return formResponse;
  }

  async findOneById(id: number): Promise<FormResponse> {
    const form = await this.formRepository
      .findOneOrFail({
        where: { id: id },
        relations: ['questions', 'questions.values', 'created_by'],
      })
      .catch((error) => {
        throw new HttpException('Form not found', 404);
      });

    delete form.created_by.password;

    if (form == null) {
      throw new HttpException('Form Not Found', 404);
    }

    const formResponse: FormResponse = {
      data: form,
      message: 'Form Retrieved Successfully',
      statusCode: 200,
    };

    return formResponse;
  }

  async getFormBelongsToUser(request: Request, formId: number) {
    const user: User = await this.authService.getUserFromCookie(request);

    const formBelongsToUser = await this.formRepository
      .createQueryBuilder('form')
      .select(['form', 'user'])
      .innerJoinAndSelect('form.created_by', 'user')
      .where('user.id = :userId', { userId: user.id })
      .andWhere('form.id = :formId', { formId: formId })
      .getExists();

    return formBelongsToUser;
  }

  async updateOne(
    request: Request,
    id: number,
    updateFormDto: UpdateFormDto,
  ): Promise<any> {
    const formBelongsToUser: boolean = await this.getFormBelongsToUser(
      request,
      id,
    );

    if (!formBelongsToUser) {
      throw new HttpException('Form not found', 404);
    }

    await this.formRepository.update(id, updateFormDto);

    const formResponse: FormResponse = {
      data: null,
      message: 'Form Updated Successfully',
      statusCode: 200,
    };

    return formResponse;
  }

  async removeOne(request: Request, id: number): Promise<FormResponse> {
    const user: User = await this.authService.getUserFromCookie(request);

    if (user.role == Role.Admin) {
      const formExists = await this.formRepository
        .findOneByOrFail({ id })
        .catch((error) => {
          throw new HttpException('Form Not Found', 404);
        });

      await this.formRepository.delete({ id });

      const formResponse: FormResponse = {
        data: null,
        message: 'Form Deleted Successfully',
        statusCode: 200,
      };

      return formResponse;
    }

    const formBelongsToUser: boolean = await this.getFormBelongsToUser(
      request,
      id,
    );

    if (!formBelongsToUser) {
      throw new HttpException('Form not found', 404);
    }

    await this.formRepository.delete({ id });

    const formResponse: FormResponse = {
      data: null,
      message: 'Form Deleted Successfully',
      statusCode: 200,
    };

    return formResponse;
  }

  async toggleFormStatusToOpen(
    request: Request,
    id: number,
  ): Promise<FormResponse> {
    const user = await this.authService.getUserFromCookie(request);

    const formResponse: FormResponse = {
      data: null,
      message: 'Form Opened Successfully',
      statusCode: 200,
    };

    if (user.role == Role.Admin) {
      const formExists = await this.formRepository
        .findOneByOrFail({ id })
        .catch((error) => {
          throw new NotFoundException('Form Not Found');
        });

      await this.formRepository
        .createQueryBuilder('form')
        .update(Form)
        .set({ status: FormStatus.open })
        .where('form.id = :formId', { formId: id })
        .execute()
        .catch((error) => {
          throw new HttpException('Failed to update form', 400);
        });

      return formResponse;
    }

    const formBelongsToUser: boolean = await this.getFormBelongsToUser(
      request,
      id,
    );

    if (!formBelongsToUser) {
      throw new HttpException('Form not found', 404);
    }

    await this.formRepository
      .createQueryBuilder('form')
      .update(Form)
      .set({ status: FormStatus.open })
      .where('form.id = :formId', { formId: id })
      .execute()
      .catch((error) => {
        throw new HttpException('Failed to update form', 400);
      });

    return formResponse;
  }

  async toggleFormStatusToClosed(
    request: Request,
    id: number,
  ): Promise<FormResponse> {
    const user = await this.authService.getUserFromCookie(request);

    const formResponse: FormResponse = {
      data: null,
      message: 'Form Closed Successfully',
      statusCode: 200,
    };

    if (user.role == Role.Admin) {
      const formExists = await this.formRepository
        .findOneByOrFail({ id })
        .catch((error) => {
          throw new NotFoundException('Form Not Found');
        });

      this.formRepository
        .createQueryBuilder('form')
        .update(Form)
        .set({ status: FormStatus.closed })
        .where('form.id = :formId', { formId: id })
        .execute()
        .catch((error) => {
          throw new HttpException('Failed to update form', 400);
        });

      return formResponse;
    }

    const formBelongsToUser: boolean = await this.getFormBelongsToUser(
      request,
      id,
    );

    if (!formBelongsToUser) {
      throw new HttpException('Form not found', 404);
    }

    await this.formRepository
      .createQueryBuilder('form')
      .update(Form)
      .set({ status: FormStatus.closed })
      .where('form.id = :formId', { formId: id })
      .execute()
      .catch((error) => {
        throw new HttpException('Failed to update form', 400);
      });

    return formResponse;
  }

  async fillForm(
    request: Request,
    formId: number,
    questionAnswersDto: QuestionAnswerDto[],
  ): Promise<ApiResponse<null>> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    const form: Form = await this.formRepository
      .findOneOrFail({
        where: { id: formId },
        relations: ['questions'],
      })
      .catch((error) => {
        throw new HttpException('Form not found', 404);
      });

    const questionsCountInForm = form.questions.length;
    const questionsCountInRequest = questionAnswersDto.length;

    if (questionsCountInForm != questionsCountInRequest) {
      throw new HttpException('Please fill all questions of form', 400);
    }

    const user: User = await this.authService.getUserFromCookie(request);

    const responseExistsForUser = await this.responseRepository.exists({
      where: { filled_by: user },
    });

    if (responseExistsForUser) {
      throw new HttpException('User has already filled the form', 400);
    }

    const response: Response = await this.responseRepository.save({
      form: form,
      filled_by: user,
    });

    await queryRunner.startTransaction();
    try {
      for (const questionAnswerDto of questionAnswersDto) {
        const { questionId, answer } = questionAnswerDto;

        const questionResponse: QuestionResponse =
          await this.questionService.findOneById(questionId);

        const question = questionResponse.data;
        if (question.form.id != formId) {
          throw new HttpException('Question doesnot belong to form', 400);
        }

        const savedAnswerResponse = await this.answersService.fillAnswer(
          questionId,
          response.id,
          answer,
        );
      }

      await queryRunner.commitTransaction();
      return {
        data: null,
        message: 'Form Filled Successfully',
        statusCode: 200,
      };
    } catch (error) {
      await this.responseRepository.delete(response.id);
      await queryRunner.rollbackTransaction();

      throw new HttpException(error.message ?? 'Failed to fill form', 400);
    } finally {
      await queryRunner.release();
    }
  }

  async getResponsesForAForm(
    id: number,
    request: Request,
  ): Promise<FormResponse> {
    const user = await this.authService.getUserFromCookie(request);

    if (user.role == 'admin') {
      const form = await this.formRepository.findOne({
        where: { id: id },
        relations: [
          'responses',
          'responses.answers',
          'responses.filled_by',
          'responses.answers.question',
          'responses.answers.question.values',
        ],
      });

      form.responses.forEach((response) => {
        delete response.filled_by.password;
        response.answers.forEach((answer) => {
          answer.question.values.forEach((value) => {
            delete value.created_at;
            delete value.updated_at;
            delete value.id;
          });
        });
      });

      return {
        data: form,
        message: 'Retrieved all form responses successfully',
        statusCode: 200,
      };
    }

    const form = await this.getFormBelongsToUser(request, id);
  }
}
