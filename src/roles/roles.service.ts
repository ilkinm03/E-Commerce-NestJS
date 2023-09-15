import {
  ConflictException, forwardRef, Inject,
  Injectable, NotFoundException,
} from "@nestjs/common";
import { Role, User } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { UsersService } from "../users/users.service";
import { AddPermissionDto, RemovePermissionDto, CreateRoleDto } from "./dtos";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class RolesService {
  constructor(
      private readonly prismaService: PrismaService,
      private readonly usersService: UsersService,
  ) {}

  public async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const [roleWithTitle]: Role[] = await this.getRoles(createRoleDto.title);
    if (roleWithTitle) {
      throw new ConflictException("role already exists");
    }
    return this.prismaService.role.create({
      data: {
        ...createRoleDto,
        guid: uuidv4(),
      },
    });
  }

  /* TODO rename `getRoles` method name or create another method for getting role by title.
   Because, `title` is a unique field and the method should not return array of Roles. */
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

  public async getRoleById(id: number): Promise<Role> {
    return this.prismaService.role.findUnique({
      where: {
        id,
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

  public async getRolesByUserGuid(userGuid: string): Promise<Role[]> {
    const user: Partial<User> = await this.usersService.user(userGuid);
    if (!user) {
      throw new NotFoundException("user not found");
    }
    return this.prismaService.role.findMany({
      where: {
        RolesOnUsers: {
          some: {
            user_id: user.id,
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
      include: {
        permisisons: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  public async removePermission(removePermissionDto: RemovePermissionDto): Promise<Role> {
    const { id, permissionId }: RemovePermissionDto = removePermissionDto;
    return this.prismaService.role.update({
      where: {
        id,
      },
      data: {
        permisisons: {
          delete: {
            permission_id_role_id: {
              role_id: id,
              permission_id: permissionId,
            },
          },
        },
      },
    });
  }

  public async deleteRoleById(id: number): Promise<Role> {
    return this.prismaService.role.delete({
      where: {
        id,
      },
    });
  }
}