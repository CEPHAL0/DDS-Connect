import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/CreateUser.doto';
import { UserReponse } from '../../types/user-response';
import { Response } from 'express';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('fetch')
  getUsers(): Array<Object> {
    return this.userService.fetchUsers();
  }

  @Get('posts')
  getUsersPosts() {
    return [
      {
        username: 'Sharad',
        email: 'sharad.sharma@deerwalk.edu.np',
        posts: [
          {
            id: 1,
            title: 'Post 1',
          },
          {
            id: 2,
            title: 'Post 2',
          },
        ],
      },
    ];
  }

  @Post()
  @UsePipes(new ValidationPipe({}))
  createUser(@Body() body: CreateUserDto): UserReponse {
    return this.userService.postUser(body);
  }

  // Get by parameter in URL
  @Get(':id')
  getUserbyId(@Param('id', ParseIntPipe) id: string) {
    console.log(id);
    return { id: id };
  }

  // Get Multiple Parameter in the same route
  // @Get(":id/:postId")
  // getUserbyIdPostbyId(@Param("id") id: number, @Param("postId") postId: number){
  //   console.log({id, postId})
  //   return {id, postId}
  // }

  // Query Parameters Example URL: http://example.com?searchResults=hello+world&output=hello
  @Get('params')
  getUserByParams(
    @Query('searchResults') searchResults: string,
    @Query('index') index: number,
  ) {
    console.log({ searchResults, index });
    return { searchResults, index };
  }
}
