import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateQuestionDto } from 'src/dtos/create-question.dto';
import { UpdateQuestionDto } from 'src/dtos/update-question.dto';
import { QuestionService } from 'src/services/question.service';
import { ApiResponse } from 'src/types/reponse-types/base-response.type';
import {
  QuestionResponse,
  QuestionsForASingleFormResponse,
  QuestionsResponse,
} from 'src/types/reponse-types/question-response.type';
import { Role } from 'src/types/role.enum';

@Controller('questions')
@Roles(Role.Admin, Role.Member)
export class QuestionsController {
  @Inject()
  private readonly questionService: QuestionService;

  @Post('create')
  async createOneQuestion(
    @Req() request: Request,
    @Body('question', new ValidationPipe())
    createQuestionDto: CreateQuestionDto,
    @Body('formId') formId: number,
  ) {
    const response = await this.questionService.createOneQuestion(
      request,
      createQuestionDto,
      formId,
    );

    return response;
  }

  @Get()
  async getAllQuestions() {
    const questionsResponse: QuestionsResponse =
      await this.questionService.getAllQuestions();

    return questionsResponse;
  }

  @Get('/form/:id')
  async getAllQuestionsForAForm(
    @Param('id', ParseIntPipe) formId: number,
  ): Promise<QuestionsForASingleFormResponse> {
    const response = await this.questionService.getAllQuestionsForAForm(formId);
    return response;
  }

  @Post('/create/form/:id')
  async createMultipleQuestionsForAForm(
    @Param('id', ParseIntPipe) formId: number,
    @Body() createQuestionsDto: CreateQuestionDto[],
  ): Promise<ApiResponse<null>> {
    const response = await this.questionService.createMultipleQuestionsForForm(
      formId,
      createQuestionsDto,
    );

    return response;
  }

  @Put('update/:id')
  async updateOneQuestion(
    @Param('id', ParseIntPipe) questionId: number,
    @Req() request: Request,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    const response: QuestionResponse =
      await this.questionService.updateOneQuestion(
        request,
        questionId,
        updateQuestionDto,
      );

    return response;
  }

  @Delete('delete/:id')
  async deleteOneQuestion(
    @Param('id', ParseIntPipe) questionId: number,
    @Req() request: Request,
  ) {
    const response: QuestionResponse =
      await this.questionService.deleteOneQuestionFromForm(request, questionId);

    return response;
  }

  @Delete('delete/form/:id')
  async deleteAllQuestionsForForm(
    @Param('id', ParseIntPipe) formId: number,
    @Req() request: Request,
  ) {
    const response: ApiResponse<null> =
      await this.questionService.deleteAllQuestionsFromForm(request, formId);

    return response;
  }
}
