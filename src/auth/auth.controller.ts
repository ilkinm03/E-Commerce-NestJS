import {
  Body,
  Controller, Get,
  HttpCode,
  HttpStatus,
  Post, Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse, ApiExcludeEndpoint, ApiHeader, ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CurrentUser } from "../common/decorators";
import {
  GoogleOauth2Guard,
  JwtAuthGuard,
  JwtRefreshGuard,
} from "../common/guards";
import { IGoogleUser } from "../users/interfaces";
import { TokensResponse } from "./api/response";
import { AuthService } from "./auth.service";
import { LoginDto, SignupDto } from "./dtos";
import { ITokens } from "./interfaces";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @ApiOkResponse({
    description: "Creates user and returns tokens",
    type: TokensResponse,
  })
  @ApiConflictResponse({
    description: "User with provided email already exists",
  })
  @ApiNotFoundResponse({
    description: "Role with provided role id not found",
  })
  @ApiBody({
    type: SignupDto,
  })
  @Post("/local/signup")
  @HttpCode(HttpStatus.CREATED)
  public async signup(@Body() signupDto: SignupDto): Promise<ITokens> {
    return this.authService.signup(signupDto);
  }

  @ApiOkResponse({
    description: "Returns the logged in user's tokens",
    type: TokensResponse,
  })
  @ApiBody({
    type: LoginDto,
  })
  @Post("/local/login")
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: LoginDto): Promise<ITokens> {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth("jwt-access")
  @ApiOkResponse({
    description: "Logs out the user",
  })
  @Post("/logout")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async logout(@CurrentUser("id") userId: number): Promise<void> {
    return this.authService.logout(userId);
  }

  @ApiBearerAuth("jwt-refresh")
  @ApiOkResponse({
    description: "Refreshes the expired access token",
    type: TokensResponse,
  })
  @Post("/refresh")
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  public async refresh(
    @CurrentUser("sub") userId: number,
    @CurrentUser("refreshToken") refreshToken: string,
  ): Promise<ITokens> {
    return this.authService.refresh(userId, refreshToken);
  }

  @Get("/google")
  @UseGuards(GoogleOauth2Guard)
  public async googleLogin(): Promise<void> {}

  @Get("/google/callback")
  @UseGuards(GoogleOauth2Guard)
  public async googleCallback(@Req() request: Request & {
    user: IGoogleUser
  }): Promise<ITokens> {
    return this.authService.googleLogin(request.user);
  }
}