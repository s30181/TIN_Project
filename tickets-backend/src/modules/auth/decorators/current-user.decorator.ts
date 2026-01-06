import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserDto } from '../../users/dto/user.dto';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDto => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: UserDto }>();
    return request.user;
  },
);
