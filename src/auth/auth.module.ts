import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "../config/config.service";
import { PrismaService } from "../prisma/prisma.service";
import { UsersModule } from "../users/users.module";
import { UsersService } from "../users/users.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthStrategy, JwtRefreshStrategy } from "./strategies";

@Module({
  imports: [
    JwtModule.register({}),
    UsersModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    PrismaService,
    ConfigService,
    JwtAuthStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {
}