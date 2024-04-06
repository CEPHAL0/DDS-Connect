import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { ValueService } from 'src/services/values.service';
import { ApiResponse } from 'src/types/reponse-types/base-response.type';
import { Role } from 'src/types/role.enum';

@Controller('values')
@Roles(Role.Admin, Role.Member)
export class ValuesController {
  @Inject()
  private readonly valueService: ValueService;

  @Post('create/question/:id')
  async createOneValueForAQuestion(
    @Param('id', ParseIntPipe) questionId: number,
    @Body('name') name: string,
  ) {
    const response: ApiResponse<null> =
      await this.valueService.createOneValueForAQuestion(questionId, name);

    return response;
  }

  @Patch('update/:id')
  async updateOneValue(
    @Param('id', ParseIntPipe) valueId: number,
    @Body('name') name: string,
  ) {
    const response: ApiResponse<null> = await this.valueService.updateOneValue(
      valueId,
      name,
    );
    return response;
  }

  @Delete('delete/:id')
  async deleteOneValue(@Param('id', ParseIntPipe) valueId: number) {
    const response: ApiResponse<null> =
      await this.valueService.deleteOneValue(valueId);

    return response;
  }
}
