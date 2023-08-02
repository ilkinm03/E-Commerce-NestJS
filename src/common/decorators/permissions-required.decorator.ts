import { SetMetadata } from "@nestjs/common";
import { PermissionsEnum } from "../enums";

export const PERMISSIONS_REQUIRED_KEY = "permissions_required";
export const PermissionsRequired = (...permissions: PermissionsEnum[]) =>
  SetMetadata(PERMISSIONS_REQUIRED_KEY, permissions);