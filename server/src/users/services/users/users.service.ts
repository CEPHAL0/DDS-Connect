import {
  HttpCode,
  HttpException,
  Injectable,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/CreateUser.doto';
import { UserReponse } from 'src/users/types/user-response';

@Injectable()
export class UsersService {
  private fakeUsers = [{ username: 'john doe' }];

  fetchUsers() {
    return this.fakeUsers;
  }

  @UsePipes(new ValidationPipe())
  postUser(user: CreateUserDto): UserReponse {
    return {
      data: user,
      message: 'Created User',
      success: false,
      statusCode: 200,
    };
  }
}
