import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { ConfigService } from "../config/config.service";
import { UsersService } from "../users/users.service";
import { SignupDto } from "./dtos";
import { ITokens, TokenPayload } from "./interfaces";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async signup(signupDto: SignupDto): Promise<User> {
    const {
      password,
      confirm_password,
      ...userData
    }: SignupDto = signupDto;
    if (password !== confirm_password) {
      throw new BadRequestException("passwords not match");
    }
    try {
      const hashedPassword: string = await bcrypt.hash(password, 10);
      const user: User = await this.usersService.create({
        password: hashedPassword,
        ...userData,
      });
      return user;
    } catch (error) {
      throw new ConflictException("email is already in use");
    }
  }

  private async getTokens(payload: TokenPayload): Promise<ITokens> {
    const [accessToken, refreshToken]: [string, string] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.jwtAccessTokenExp * 60,
        secret: this.configService.jwtAccessTokenSecret,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.jwtRefreshTokenExp * 60,
        secret: this.configService.jwtRefreshTokenSecret,
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
}