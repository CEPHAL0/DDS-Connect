import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { UsersService as AdminUsersService } from 'src/services/admin-users.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UserReponse } from 'src/types/reponse-types/user-response';
import { RegisterUserDto } from 'src/dtos/register-user.dto';
import { Request, Response } from 'express';
import { ApiReponse } from 'src/types/reponse-types/base-response.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: AdminUsersService,
    private jwtService: JwtService,
    private configService: ConfigService
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

    const payload = { id: user.id, username: user.username };

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
    // Setting role to 'user' when new user signs up
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




  async getUserFromCookie(request: Request): Promise<User> {
    try {
      const cookieJwt: string = request.cookies.jwt;

      const payload = await this.jwtService.verifyAsync(cookieJwt, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const username = payload.username;

      const user: User = await this.userService.findOneByUsername(username);

      return user;
    } catch {
      throw new HttpException('Failed to retrieve user', 400);
    }
  }
}
