import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entitites/user.entity';
import { UsersService as AdminUsersService } from 'src/users/services/admin/admin.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private userService: AdminUsersService, 
    private jwtService: JwtService,
) {}

  async signIn(username: string, pass: string): Promise<{access_token: string}> {
    const user: User = await this.userService.findOneByUsername(username);

    if (user?.password != pass) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.username };

    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
