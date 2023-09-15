import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "../config/config.service";
import { PermissionsService } from "../permissions/permissions.service";
import { PrismaService } from "../prisma/prisma.service";
import { UsersModule } from "../users/users.module";
import { UsersService } from "../users/users.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import {
  GoogleOauth2Strategy,
  JwtAuthStrategy,
  JwtRefreshStrategy,
} from "./strategies";

@Module({
  imports: [
    JwtModule.register({}),
    UsersModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    PermissionsService,
    PrismaService,
    ConfigService,
    JwtAuthStrategy,
    JwtRefreshStrategy,
    GoogleOauth2Strategy,
  ],
})
export class AuthModule {
}