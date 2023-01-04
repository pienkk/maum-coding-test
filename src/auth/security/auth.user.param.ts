import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtPayload } from '../jwt-payload.interface';

export const CurrentUser = createParamDecorator(
  (data: any, context: ExecutionContext): JwtPayload => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
