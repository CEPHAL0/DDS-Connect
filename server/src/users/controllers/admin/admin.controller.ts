import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import {
  UserReponse,
  UserResponseData,
  UsersResponse,
} from '../../types/user-response';
import { UsersService } from 'src/users/services/admin/admin.service';
import { User } from 'src/users/entitites/user.entity';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';

@Controller('admin/users')
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

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserReponse> {
    return this.userService.updateUser(id, updateUserDto);
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
}
