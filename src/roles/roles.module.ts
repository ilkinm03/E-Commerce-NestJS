import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RolesController } from "./roles.controller";
import { RolesService } from "./roles.service";

@Module({
  controllers: [RolesController],
  providers: [RolesService, PrismaService],
})
export class RolesModule {}