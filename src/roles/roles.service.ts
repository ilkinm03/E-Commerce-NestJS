import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Role } from "@prisma/client";
import { AddPermissionDto } from "../permissions/dtos";
import { PrismaService } from "../prisma/prisma.service";
import { CreateRoleDto } from "./dtos";

@Injectable()
export class RolesService {
  constructor(private readonly prismaService: PrismaService) {}

  public async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const [roleWithTitle]: Role[] = await this.getRoles(createRoleDto.title);
    if (roleWithTitle) {
      throw new ConflictException("role already exists");
    }
    return this.prismaService.role.create({
      data: createRoleDto,
    });
  }

  public async getRoles(title?: string): Promise<Role[]> {
    return this.prismaService.role.findMany({
      where: {
        title,
      },
      include: {
        permisisons: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  public async getRolesById(roleIDs: number[]): Promise<Role[]> {
    return this.prismaService.role.findMany({
      where: {
        id: {
          in: roleIDs,
        },
      },
    });
  }

  public async getRolesByUserId(userId: number): Promise<Role[]> {
    return this.prismaService.role.findMany({
      where: {
        RolesOnUsers: {
          some: {
            user_id: userId,
          },
        },
      },
    });
  }

  public async addPermission(addPermissionDto: AddPermissionDto): Promise<Role> {
    const {
      id,
      permissionId,
    }: AddPermissionDto = addPermissionDto;
    return this.prismaService.role.update({
      where: {
        id,
      },
      data: {
        permisisons: {
          connectOrCreate: {
            where: {
              permission_id_role_id: {
                permission_id: permissionId,
                role_id: id,
              },
            },
            create: {
              permission_id: permissionId,
            },
          },
        },
      },
    });
  }
}