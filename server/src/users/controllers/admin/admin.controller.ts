import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import {
  UserReponse,
  UsersResponse,
} from '../../types/user-response';
import { UsersService } from 'src/users/services/admin/admin.service';
import { User } from 'src/users/entitites/user.entity';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';


@UseGuards(AuthGuard)
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
    const user = await this.userService.findOne(+id);
    return user;
  }

  // Function only to get username and password for authentication
  @Get('/username/:username')
  async getUserByUsername(@Param('username') username: string): Promise<User> {
    return await this.userService.findOneByUsername(username);
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
}
