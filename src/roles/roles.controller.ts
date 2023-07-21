import { Body, Controller, Get, Patch, Post, Query } from "@nestjs/common";
import { Role } from "@prisma/client";
import { AddPermissionDto } from "../permissions/dtos";
import { CreateRoleDto } from "./dtos";
import { RolesService } from "./roles.service";

@Controller("roles")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  public async createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.rolesService.createRole(createRoleDto);
  }

  @Get()
  public async getRoles(@Query("title") title?: string): Promise<Role[]> {
    return this.rolesService.getRoles(title);
  }

  @Patch()
  public async addPermission(@Body() addPermissionDto: AddPermissionDto): Promise<Role> {
    return this.rolesService.addPermission(addPermissionDto);
  }
}