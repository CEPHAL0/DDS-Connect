import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFormDto } from 'src/dtos/create-form.dto';
import { Form } from 'src/entities/form.entity';
import { User } from 'src/entities/user.entity';
import { FormStatus } from 'src/types/form-status.enum';
import {
  FormReponse,
  FormsReponse,
} from 'src/types/reponse-types/form-reponse';
import { Repository } from 'typeorm';

import { Request } from 'express';

import { UpdateFormDto } from 'src/dtos/update-form.dto';
import { AuthService } from './auth.service';
import { Role } from 'src/types/role.enum';

@Injectable()
export class FormService {
  public constructor(
    @InjectRepository(Form)
    private formRepository: Repository<Form>,

    private authService: AuthService,
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
  ): Promise<FormReponse> {
    const status = FormStatus.open;

    const user: User = await this.authService.getUserFromCookie(request);

    const data = { ...createFormDto, status: status, created_by: user };

    await this.formRepository.save(data).catch((e) => {
      console.log(e.message);
      throw new HttpException('Failed to create form', 400);
    });

    const formResponse: FormReponse = {
      data: null,
      message: 'Form Created Successfully',
      statusCode: 200,
    };

    return formResponse;
  }

  async findOneById(id: number): Promise<FormReponse> {
    const form = await this.formRepository.findOne({
      where: { id: id },
      relations: ['questions', 'questions.values', 'created_by'],
    });

    if (form == null) {
      throw new HttpException('Form Not Found', 404);
    }

    const formResponse: FormReponse = {
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

    const formResponse: FormReponse = {
      data: null,
      message: 'Form Updated Successfully',
      statusCode: 200,
    };

    return formResponse;
  }

  async removeOne(request: Request, id: number): Promise<FormReponse> {
    const user: User = await this.authService.getUserFromCookie(request);

    if (user.role == Role.Admin) {
      
      const formExists = await this.formRepository
        .findOneByOrFail({ id })
        .catch((error) => {
          throw new HttpException('Form Not Found', 404);
        });

      await this.formRepository.delete({ id });

      const formResponse: FormReponse = {
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

    const formResponse: FormReponse = {
      data: null,
      message: 'Form Deleted Successfully',
      statusCode: 200,
    };

    return formResponse;
  }

  async toggleFormStatusToOpen(
    request: Request,
    id: number,
  ): Promise<FormReponse> {
    const user = await this.authService.getUserFromCookie(request);

    const formResponse: FormReponse = {
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
  ): Promise<FormReponse> {
    const user = await this.authService.getUserFromCookie(request);

    const formResponse: FormReponse = {
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
}
