import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entitites/user.entity';
import { UsersService as AdminUsersService } from 'src/users/services/admin-users.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UserReponse } from 'src/users/types/user-response';
import { RegisterUserDto } from 'src/users/dtos/register-user.dto';
import { Response } from 'express';
import { ApiReponse } from 'src/responses/base-response.type';

@Injectable()
export class AuthService {
  constructor(
    private userService: AdminUsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
    response: Response,
  ): Promise<ApiReponse<null>> {
    const user: User = await this.userService.findOneByUsername(username);

    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.username };

    const access_token = await this.jwtService.signAsync(payload);

    response.cookie('jwt', access_token, { httpOnly: true });

    const returnResponse: ApiReponse<null> = {
      statusCode: 200,
      message: 'Logged In Successfully',
      data: null,
    };
    return returnResponse;
  }

  async register(registerUserDto: RegisterUserDto): Promise<UserReponse> {
    const userResponse: UserReponse = await this.userService.createUser({
      ...registerUserDto,
      role: 'user',
    });

    delete userResponse.data.role;

    return userResponse;
  }

  async logout(response: Response): Promise<ApiReponse<null>> {
    response.clearCookie('jwt');
    const result: ApiReponse<null> = {
      data: null,
      message: 'Logged out successfully',
      statusCode: 200,
    };
    return result;
  }
}
