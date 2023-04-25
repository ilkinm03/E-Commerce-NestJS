import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthStrategy } from "./strategies";

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAuthStrategy,
  ],
})
export class AuthModule {
}