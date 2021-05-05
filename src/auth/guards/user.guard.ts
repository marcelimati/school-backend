import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const type = context.getType();
    const useraccess = this.reflector.get<string[]>('access', context.getHandler());

    if (!useraccess) return true;

    if (type === 'http') {
      return useraccess.includes(context.switchToHttp().getRequest().user?._id);
    }

    if (type === 'ws') {
      return useraccess.includes(context.switchToWs().getClient().user?._id);
    }

    return false;
  }
}