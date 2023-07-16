import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class RolesService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getRolesById(roleIDs: number[]) {
    return this.prismaService.role.findMany({
      where: {
        id: {
          in: roleIDs,
        },
      },
    });
  }
}