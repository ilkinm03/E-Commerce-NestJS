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
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Permission } from "@prisma/client";
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