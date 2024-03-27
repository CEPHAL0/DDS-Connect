import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import { Role } from 'src/types/role.enum';
import { UsersService } from 'src/services/admin-users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (isPublic) {
        return true;
      }

      if (!requiredRoles) {
        return true;
      }

      const { user } = await context.switchToHttp().getRequest();

      const userRole = (
        await this.usersService.findOneByUsername(user.username)
      ).role;

      return requiredRoles.some((role) => userRole == role);
    } catch (e) {
      throw new HttpException('User not found', 400);
    }
  }
}
