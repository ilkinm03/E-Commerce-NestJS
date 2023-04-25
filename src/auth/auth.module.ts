import { Module } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { PrismaService } from "../prisma/prisma.service";
import { UsersService } from "../users/users.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthStrategy } from "./strategies";

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    PrismaService,
    ConfigService,
    JwtAuthStrategy,
  ],
})
export class AuthModule {
}