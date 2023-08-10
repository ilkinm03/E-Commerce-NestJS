import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { PermissionsService } from "../roles/permissions.service";
import { RolesService } from "../roles/roles.service";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService, RolesService, PermissionsService, PrismaService],
  exports: [UsersService, RolesService, PermissionsService]
})
export class UsersModule {
}