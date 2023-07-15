import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSIONS_REQUIRED_KEY } from "../decorators";
import { PermissionsEnum } from "../enums";

@Injectable()
export class PermissionsRequiredGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions: PermissionsEnum[] = this.reflector.getAllAndOverride<PermissionsEnum[]>(
      PERMISSIONS_REQUIRED_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );
    if (!requiredPermissions) return true;
    const { user } = context.switchToHttp().getRequest();
    return requiredPermissions.every(
      (p: PermissionsEnum) => user.permissions?.includes(p),
    );
  }
}