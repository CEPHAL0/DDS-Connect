import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/signIn.dto';
import { JwtService } from '@nestjs/jwt';
import { Public } from 'src/decorators/public.decorator';
import { RegisterUserDto } from 'src/users/dtos/register-user.dto';
import { Response } from 'express';

@Public()
@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ValidationPipe())
  signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signIn(signInDto.username, signInDto.password, res);
  }

  @Public()
  @Post('signup')
  @UsePipes(new ValidationPipe())
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('logout')
  logout(@Res({passthrough: true}) response: Response){
    return this.authService.logout(response);
  }
}
