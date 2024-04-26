import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
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
import { UpdateFormDto } from 'src/dtos/update-form.dto';
import { QuestionAnswerDto } from 'src/dtos/fill-form.dto';

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
    const response = await this.formService.findOneById(id);
    return response;
  }

  @Patch('update/:id')
  async updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFormDto: UpdateFormDto,
    @Req() request: Request,
  ) {
    return this.formService.updateOne(request, id, updateFormDto);
  }

  @Delete('delete/:id')
  async removeOne(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const response = await this.formService.removeOne(request, id);
    return response;
  }

  @Patch('/toggle-open/:id')
  async toggleFormStatusToOpen(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const response = await this.formService.toggleFormStatusToOpen(request, id);

    return response;
  }

  @Patch('/toggle-closed/:id')
  async toggleFormStatusToClosed(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const response = await this.formService.toggleFormStatusToClosed(
      request,
      id,
    );

    return response;
  }

  @Public()
  @Post('/fill/:id')
  async fillForm(
    @Req() request: Request,
    @Param('id') formId: number,
    @Body() questionAnswerDtos: QuestionAnswerDto[],
  ) {
    const response = await this.formService.fillForm(
      request,
      formId,
      questionAnswerDtos,
    );

    return response;
  }
}
