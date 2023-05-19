import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "../common/decorators";
import { JwtAuthGuard, JwtRefreshGuard } from "../common/guards";
import { AuthService } from "./auth.service";
import { LoginDto, SignupDto } from "./dtos";
import { ITokens } from "./interfaces";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post("/local/signup")
  @HttpCode(HttpStatus.CREATED)
  public async signup(@Body() signupDto: SignupDto): Promise<ITokens> {
    return this.authService.signup(signupDto);
  }

  @Post("/local/login")
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: LoginDto): Promise<ITokens> {
    return this.authService.login(loginDto);
  }

  @Post("/logout")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async logout(@CurrentUser("id") userId: number): Promise<void> {
    return this.authService.logout(userId);
  }

  @Post("/refresh")
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  public async refresh(
    @CurrentUser("sub") userId: number,
    @CurrentUser("refreshToken") refreshToken: string,
  ): Promise<ITokens> {
    return this.authService.refresh(userId, refreshToken);
  }
}