import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { Permission } from "@prisma/client";
import { GenericResponse } from "../common/api";
import { PermissionsRequired, Serialize } from "../common/decorators";
import { PermissionsEnum } from "../common/enums";
import { JwtAuthGuard, PermissionsRequiredGuard } from "../common/guards";
import {
  CreatePermissionDto,
  PermissionsDto,
  UpdatePermissionDto,
} from "./dtos";
import { PermissionsService } from "./permissions.service";

@ApiTags("permissions")
@UseGuards(JwtAuthGuard, PermissionsRequiredGuard)
@PermissionsRequired(PermissionsEnum.PERMISSIONS_READ, PermissionsEnum.PERMISSIONS_WRITE)
@Controller("permissions")
@Serialize(PermissionsDto)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @ApiOkResponse({
    description: "Finds and returns all the permissions",
    type: [PermissionsDto],
  })
  @Get()
  public async getPermissions(): Promise<Permission[]> {
    return this.permissionsService.getPermissions();
  }

  @ApiOkResponse({
    description: "Finds a permission with the provided id",
    type: PermissionsDto
  })
  @ApiNotFoundResponse({
    description: "No permission found with the provided id",
  })
  @ApiParam({
    description: "Id of the permission",
    name: "id",
  })
  @Get(":guid")
  public async getPermissionById(@Param("guid") guid: string): Promise<Permission> {
    return this.permissionsService.findUniquePermissionByGuid(guid);
  }

  @ApiOkResponse({
    description: "Creates and returns the permission",
    type: PermissionsDto,
  })
  @ApiConflictResponse({
    description: "A permission already exists with the provided title",
  })
  @ApiBody({ type: CreatePermissionDto  })
  @Post()
  public async createPermission(@Body() createPermissionsDto: CreatePermissionDto): Promise<GenericResponse> {
    return this.permissionsService.createPermission(createPermissionsDto);
  }

  @ApiOkResponse({
    description: "Updates and returns the permission",
    type: PermissionsDto,
  })
  @ApiNotFoundResponse({
    description: "Permission with the provided title not found",
  })
  @ApiBody({ type: UpdatePermissionDto })
  @Patch()
  public async updatePermission(@Body() updatePermissionDto: UpdatePermissionDto): Promise<GenericResponse> {
    return this.permissionsService.updatePermission(updatePermissionDto);
  }

  @ApiOkResponse({
    description: "Deletes and returns the permission",
    type: PermissionsDto,
  })
  @ApiNotFoundResponse({
    description: "Permission with the provided id not found",
  })
  @ApiParam({
    description: "Id of the permission",
    name: "id",
  })
  @Delete(":guid")
  public async deletePermission(@Param("guid") guid: string): Promise<GenericResponse> {
    return this.permissionsService.deletePermission(guid);
  }
}