import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PermissionsService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getPermissionsByRoleIds(roleIds: number[]) {
    return this.prismaService.permission.findMany({
      where: {
        roles: {
          some: { role_id: { in: roleIds } },
        },
      },
    });
  }
}