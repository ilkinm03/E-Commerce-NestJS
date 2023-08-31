import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { PermissionsController } from "./permissions.controller";
import { PermissionsService } from "./permissions.service";

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService, PrismaService]
})
export class PermissionsModule {}