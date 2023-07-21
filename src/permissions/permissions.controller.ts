import { Body, Controller, Post } from "@nestjs/common";
import { Permission } from "@prisma/client";
import { CreatePermissionDto } from "./dtos";
import { PermissionsService } from "./permissions.service";

@Controller("permissions")
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  public async createPermission(@Body() createPermissionsDto: CreatePermissionDto): Promise<Permission> {
    return this.permissionsService.createPermission(createPermissionsDto);
  }
}