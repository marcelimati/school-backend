import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const type = context.getType();
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) return true;

    if (type === 'http') {
      return roles.includes(context.switchToHttp().getRequest().user?.role);
    }

    if (type === 'ws') {
      return roles.includes(context.switchToWs().getClient().user?.role);
    }

    return false;
  }
}