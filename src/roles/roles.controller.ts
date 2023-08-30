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
  ApiOkResponse, ApiParam, ApiQuery,
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

  @ApiOkResponse({
    description: "Returns all the roles",
    type: [RolesDto],
  })
  @ApiQuery({
    description: "Title of the role",
    name: "title",
    type: String,
  })
  @Get()
  public async getRoles(@Query("title") title?: string): Promise<Role[]> {
    return this.rolesService.getRoles(title);
  }

  @ApiOkResponse({
    description: "Returns a role with the provided id",
    type: RolesDto,
  })
  @ApiParam({
    description: "Id of the role",
    name: "id",
  })
  @Get(":id")
  public async getRole(@Param("id", ParseIntPipe) id: number): Promise<Role> {
    return this.rolesService.getRoleById(id);
  }

  @ApiOkResponse({
    description: "Grant a role with a permission and return the role",
    type: RolesDto
  })
  @ApiBody({ type: AddPermissionDto })
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