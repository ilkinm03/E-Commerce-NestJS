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
import { Serialize } from "../common/decorators";
import { CreateRoleDto, AddPermissionDto, RemovePermissionDto } from "./dtos";
import { RolesDto } from "./dtos/roles.dto";
import { RolesService } from "./roles.service";

@Controller("roles")
@Serialize(RolesDto)
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

  @Patch("grant")
  public async grantPermission(@Body() addPermissionDto: AddPermissionDto): Promise<Role> {
    return this.rolesService.addPermission(addPermissionDto);
  }

  @Patch("provoke")
  public async provokePermission(@Body() removePermissionDto: RemovePermissionDto): Promise<Role> {
    return this.rolesService.removePermission(removePermissionDto);
  }

  @Delete(":id")
  public async deleteRole(@Param("id", ParseIntPipe) id: number): Promise<Role> {
    return this.rolesService.deleteRoleById(id);
  }
}