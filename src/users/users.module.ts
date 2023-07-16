import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RolesService } from "./roles/roles.service";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService, RolesService, PrismaService],
  exports: [UsersService, RolesService]
})
export class UsersModule {
}