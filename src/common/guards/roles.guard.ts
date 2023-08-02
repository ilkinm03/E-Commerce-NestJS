import { ExecutionContext, Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";
import { ROLES_KEY } from "../decorators";
import { RolesEnum } from "../enums/roles.enum";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public canActive(context: ExecutionContext): boolean {
    const requiredRoles: Role = this.reflector.getAllAndOverride<RolesEnum[]>(
      ROLES_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );
    if (!requiredRoles) return true;
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some(
      (r: RolesEnum) => user.role?.includes(r),
    );
  }
}