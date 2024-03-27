import { HttpException, Inject, Injectable } from '@nestjs/common';
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

@Injectable()
export class FormService {
  public constructor(
    @InjectRepository(Form)
    private formRepository: Repository<Form>,

    private authService: AuthService

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
    id: number,
    updateFormDto: UpdateFormDto,
  ): Promise<any> {
    const form: Form = await this.formRepository.findOneBy({ id });

    if (form == null) {
      throw new HttpException('Form not found', 404);
    }
  }


}
