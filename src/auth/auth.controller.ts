import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
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
}