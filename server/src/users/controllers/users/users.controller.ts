import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CreateUserDto } from 'src/users/dtos/CreateUser.doto';
import {
  UserReponse,
  UserResponseData,
  UsersResponse,
} from '../../types/user-response';
import { Response } from 'express';
import { UsersService } from 'src/users/services/users/users.service';
import { User } from 'src/users/entitites/user.entity';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  async getUsers(): Promise<UsersResponse> {
    const users = await this.userService.findAll();
    return users;
  }

  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserReponse> {
    const user = await this.userService.findOne(id);
    return user;
  }

  @Post('')
  @UsePipes(new ValidationPipe())
  async createUser(@Body() user: CreateUserDto): Promise<UserReponse> {
    const userResponse: UserReponse = await this.userService.createUser(user);
    return userResponse;
  }

  @Delete(':id')
  async removeUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserReponse> {
    return this.userService.remove(id);
  }

  // @Get('fetch')
  // getUsers(): Array<Object> {
  //   return this.userService.fetchUsers();
  // }

  // @Get('posts')
  // getUsersPosts() {
  //   return [
  //     {
  //       username: 'Sharad',
  //       email: 'sharad.sharma@deerwalk.edu.np',
  //       posts: [
  //         {
  //           id: 1,
  //           title: 'Post 1',
  //         },
  //         {
  //           id: 2,
  //           title: 'Post 2',
  //         },
  //       ],
  //     },
  //   ];
  // }

  // @Post()
  // @UsePipes(new ValidationPipe({}))
  // createUser(@Body() body: CreateUserDto): UserReponse {
  //   return this.userService.postUser(body);
  // }

  // // Get by parameter in URL
  // @Get(':id')
  // getUserbyId(@Param('id', ParseIntPipe) id: string) {
  //   console.log(id);
  //   return { id: id };
  // }

  // // Get Multiple Parameter in the same route
  // // @Get(":id/:postId")
  // // getUserbyIdPostbyId(@Param("id") id: number, @Param("postId") postId: number){
  // //   console.log({id, postId})
  // //   return {id, postId}
  // // }

  // // Query Parameters Example URL: http://example.com?searchResults=hello+world&output=hello
  // @Get('params')
  // getUserByParams(
  //   @Query('searchResults') searchResults: string,
  //   @Query('index') index: number,
  // ) {
  //   console.log({ searchResults, index });
  //   return { searchResults, index };
  // }
}
