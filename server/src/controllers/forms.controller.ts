import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/types/role.enum';
import { CreateFormDto } from '../dtos/create-form.dto';
import { FormService } from 'src/services/forms.service';
import {
  FormReponse,
  FormsReponse,
} from 'src/types/reponse-types/form-reponse';
import { User } from 'src/entities/user.entity';
import { Request } from 'express';
import { Public } from 'src/decorators/public.decorator';

@Roles(Role.Admin, Role.Member)
@Controller('forms')
export class FormsController {
  @Inject()
  private readonly formService: FormService;

  @Public()
  @Get()
  async index(): Promise<FormsReponse> {
    const forms: FormsReponse = await this.formService.findAll();
    return forms;
  }

  @Post('create')
  @UsePipes(new ValidationPipe())
  async createOne(
    @Body() createFormDto: CreateFormDto,
    @Req() request: Request,
  ) {
    const response: FormReponse = await this.formService.createForm(
      request,
      createFormDto,
    );

    return response;
  }

  @Public()
  @Get(':id')
  async getFormById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    
    const response: FormReponse = await this.formService.findOneById(id);
    return response;
  }
}
