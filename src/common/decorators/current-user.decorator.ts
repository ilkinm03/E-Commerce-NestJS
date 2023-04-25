import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator((
  _: undefined,
  ctx: ExecutionContext,
): number => {
  const request = ctx.switchToHttp().getRequest();
  return request.user["sub"];
});