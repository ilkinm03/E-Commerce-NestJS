import { ConflictException, Injectable } from "@nestjs/common";
import { Permission } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePermissionDto } from "./dtos";

@Injectable()
export class PermissionsService {
  constructor(private readonly prismaService: PrismaService) {}

  public async createPermission(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const existingPermission: Permission = await this.findUniquePermissionByTitle(
      createPermissionDto.title);
    if (existingPermission) {
      throw new ConflictException("permission already exists");
    }
    return this.prismaService.permission.create({
      data: createPermissionDto,
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