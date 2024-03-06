import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private jwtService: JwtService, private configService: ConfigService){}

  async canActivate(context: ExecutionContext): Promise<boolean>{

    const request = context.switchToHttp().getRequest();
    const token = this.extractFromHeader(request);
    if (!token){
      throw new UnauthorizedException()
    }
    try{
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.configService.get<string>('JWT_SECRET')
        }
      );

      request["user"] = payload;
    }catch (error: any){
      console.log(error.message);
      throw new UnauthorizedException();
    }
    return true;
  }


  private extractFromHeader(request: Request): string | undefined{
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
