import { Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class RolesService {
  constructor(private readonly prismaService: PrismaService) {}

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
}