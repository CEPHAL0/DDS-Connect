import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CreateUserDto } from 'src/dtos/create-user.dto';
import {
  UserReponse,
  UsersResponse,
} from '../types/reponse-types/user-response';
import { UsersService } from 'src/services/admin-users.service';
import { User } from 'src/entities/user.entity';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/types/role.enum';
import { Public } from 'src/decorators/public.decorator';
import { Request } from 'express';

@Roles(Role.Admin)
@Controller('admin/users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  async getUsers(): Promise<UsersResponse> {
    const users = await this.userService.findAll();
    return users;
  }

  @Roles(Role.Admin, Role.Member, Role.User)
  // @Public()
  @Get('profile')
  async getProfile(@Req() request: Request) {
    const response = await this.userService.getProfile(request);
    return response;
  }

  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserReponse> {
    const user = await this.userService.findOne(+id);
    return user;
  }

  // Used for authentication
  @Get('/username/:username')
  async getUserByUsername(@Param('username') username: string): Promise<User> {
    return await this.userService.findOneByUsername(username);
  }

  @Post('/create')
  @UsePipes(new ValidationPipe())
  async createUser(@Body() user: CreateUserDto): Promise<UserReponse> {
    const userResponse: UserReponse = await this.userService.createUser(user);
    return userResponse;
  }

  @Delete('/delete/:id')
  async removeUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserReponse> {
    return this.userService.remove(id);
  }

  @Patch('/update/:id')
  @UsePipes(new ValidationPipe())
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserReponse> {
    return this.userService.updateUser(id, updateUserDto);
  }
}
