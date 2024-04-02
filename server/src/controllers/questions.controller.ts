import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateQuestionDto } from 'src/dtos/create-question.dto';
import { QuestionService } from 'src/services/question.service';
import { QuestionsResponse } from 'src/types/reponse-types/question-response.type';
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
}
