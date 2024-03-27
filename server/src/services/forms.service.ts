import {
  HttpException,
  Inject,
  Injectable,
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
import { UsersService } from './admin-users.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
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
    const forms = await this.formRepository.find();

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
    const currentDate = Date.now();
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
    const form = await this.formRepository.findOneBy({ id });

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

  async updateOne(
    request: Request,
    id: number,
    updateFormDto: UpdateFormDto,
  ): Promise<any> {
    const user: User = await this.authService.getUserFromCookie(request);

    const form: Form = await this.formRepository
      .createQueryBuilder('form')
      .select(['form', 'user'])
      .innerJoinAndSelect('form.created_by', 'user')
      .where('user.id = :userId', { userId: user.id })
      .andWhere('form.id = :formId', { formId: id })
      .getOne();

    if (form == null) {
      throw new HttpException('Form not found', 404);
    }

    await this.formRepository.update(form.id, updateFormDto);

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
      await this.formRepository.delete({ id });

      const formResponse: FormReponse = {
        data: null,
        message: 'Form Deleted Successfully',
        statusCode: 200,
      };

      return formResponse;
    }

    const form: Form = await this.formRepository
      .createQueryBuilder('form')
      .select(['form', 'user'])
      .innerJoinAndSelect('form.created_by', 'user')
      .where('user.id = :userId', { userId: user.id })
      .andWhere('form.id = :formId', { formId: id })
      .getOne();

    if (form == null) {
      throw new UnauthorizedException('Form not found');
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
      message: 'Form Updated Successfully',
      statusCode: 200,
    };

    if (user.role == Role.Admin) {
      this.formRepository
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

    const formExistsAndBelongsTouser = await this.formRepository
      .createQueryBuilder('form')
      .select(['form', 'user'])
      .innerJoinAndSelect('form.created_by', 'user')
      .where('user.id = :userId', { userId: user.id })
      .andWhere('form.id = :formId', { formId: id })
      .getExists();

    if (!formExistsAndBelongsTouser) {
      throw new UnauthorizedException('Cannot toggle form');
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
      message: 'Form Updated Successfully',
      statusCode: 200,
    };

    if (user.role == Role.Admin) {
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

    const formExistsAndBelongsTouser = await this.formRepository
      .createQueryBuilder('form')
      .select(['form', 'user'])
      .innerJoinAndSelect('form.created_by', 'user')
      .where('user.id = :userId', { userId: user.id })
      .andWhere('form.id = :formId', { formId: id })
      .getExists();

    if (!formExistsAndBelongsTouser) {
      throw new UnauthorizedException('Cannot toggle form');
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
