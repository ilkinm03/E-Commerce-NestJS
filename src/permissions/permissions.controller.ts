import {
  Body,
  Controller, Delete,
  Get,
  Param,
  ParseIntPipe, Patch,
  Post,
} from "@nestjs/common";
import { Permission } from "@prisma/client";
import { CreatePermissionDto, UpdatePermissionDto } from "./dtos";
import { PermissionsService } from "./permissions.service";

@Controller("permissions")
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  public async getPermissions(): Promise<Permission[]> {
    return this.permissionsService.getPermissions();
  }

  @Get(":id")
  public async getPermissionById(@Param(
    "id",
    ParseIntPipe,
  ) id: number): Promise<Permission> {
    return this.permissionsService.findUniquePermissionById(id);
  }

  @Post()
  public async createPermission(@Body() createPermissionsDto: CreatePermissionDto): Promise<Permission> {
    return this.permissionsService.createPermission(createPermissionsDto);
  }

  @Patch()
  public async updatePermission(@Body() updatePermissionDto: UpdatePermissionDto): Promise<Permission> {
    return this.permissionsService.updatePermission(updatePermissionDto);
  }

  @Delete(":id")
  public async deletePermission(@Param(
    "id",
    ParseIntPipe,
  ) id: number): Promise<Permission> {
    return this.permissionsService.deletePermission(id);
  }
}