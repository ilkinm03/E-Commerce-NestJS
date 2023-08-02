import { SetMetadata } from "@nestjs/common";
import { RolesEnum } from "../enums/roles.enum";

export const ROLES_KEY = "roles_required";

export const Roles = (...roles: RolesEnum[]) => SetMetadata(ROLES_KEY, roles);