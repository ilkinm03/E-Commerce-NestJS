import {
  Body,
  Controller,
  Delete,
  Get, Param, ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
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

  @Get(":id")
  public async getRole(@Param("id", ParseIntPipe) id: number): Promise<Role> {
    return this.rolesService.getRoleById(id);
  }

  @Patch()
  public async addPermission(@Body() addPermissionDto: AddPermissionDto): Promise<Role> {
    return this.rolesService.addPermission(addPermissionDto);
  }
}