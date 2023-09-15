import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Permission, Role } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { GenericResponse } from "../common/api";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePermissionDto, UpdatePermissionDto } from "./dtos";

@Injectable()
export class PermissionsService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getPermissions(): Promise<Permission[]> {
    return this.prismaService.permission.findMany({});
  }

  public async getPermissionsByRoleGuids(roleGuids: string[]): Promise<Permission[]> {
    const roles: Pick<Role, "id">[] = await this.prismaService.role.findMany({
      where: {
        guid: {
           in: roleGuids,
        },
      },
      select: { id: true },
    });
    const roleIds: number[] = roles.map(role => role.id);
    return this.prismaService.permission.findMany({
      where: {
        roles: {
          some: { role_id: { in: roleIds } },
        },
      },
    });
  }

  public async findUniquePermissionByGuid(guid: string): Promise<Permission> {
    const permission: Permission = await this.prismaService.permission.findUnique(
      {
        where: {
          guid,
        },
      });
    if (!permission) {
      throw new NotFoundException("permission not found");
    }
    return permission;
  }

  public async createPermission(createPermissionDto: CreatePermissionDto): Promise<GenericResponse> {
    const existingPermission: Permission = await this.findUniquePermissionByTitle(
      createPermissionDto.title);
    if (existingPermission) {
      throw new ConflictException("permission already exists");
    }
    const permission: Permission = await this.prismaService.permission.create({
      data: {
        ...createPermissionDto,
        guid: uuidv4(),
      },
    });
    return { guid: permission.guid };
  }

  public async updatePermission(updatePermissionDto: UpdatePermissionDto): Promise<GenericResponse> {
    const { title }: UpdatePermissionDto = updatePermissionDto;
    const existingPermission: Permission = await this.findUniquePermissionByTitle(title);
    if (!existingPermission) {
      throw new NotFoundException("permission not found");
    }
    const permission: Permission = await this.prismaService.permission.update({
      where: {
        title,
      },
      data: {
        title,
      },
    });
    return { guid: permission.guid };
  }

  public async deletePermission(guid: string): Promise<GenericResponse> {
    await this.findUniquePermissionByGuid(guid);
    return this.prismaService.permission.delete({
      where: {
        guid,
      },
    });
  }

  private async findUniquePermissionByTitle(title: string): Promise<Permission> {
    return this.prismaService.permission.findUnique({
      where: {
        title,
      },
    });
  }
}