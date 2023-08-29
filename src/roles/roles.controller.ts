import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBody,
  ApiConflictResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { PermissionsRequired, Serialize } from "../common/decorators";
import { PermissionsEnum } from "../common/enums";
import { JwtAuthGuard, PermissionsRequiredGuard } from "../common/guards";
import {
  AddPermissionDto,
  CreateRoleDto,
  RemovePermissionDto,
  RolesDto,
} from "./dtos";
import { RolesService } from "./roles.service";

@ApiTags("roles")
@Controller("roles")
@UseGuards(JwtAuthGuard, PermissionsRequiredGuard)
@PermissionsRequired(PermissionsEnum.ROLES_READ, PermissionsEnum.ROLES_WRITE)
@Serialize(RolesDto)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOkResponse({
    description: "Creates and returns the role",
    type: RolesDto,
  })
  @ApiConflictResponse({
    description: "Role with the provided title already exists",
  })
  @ApiBody({ type: CreateRoleDto })
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