import { Module } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthStrategy } from "./strategies";

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    ConfigService,
    JwtAuthStrategy,
  ],
})
export class AuthModule {
}