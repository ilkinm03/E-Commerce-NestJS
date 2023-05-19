import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator((
  data: string,
  ctx: ExecutionContext,
): number => {
  const request = ctx.switchToHttp().getRequest();
  if (!request.user) return request.user;
  return request.user[data];
});