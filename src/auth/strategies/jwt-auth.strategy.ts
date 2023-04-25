import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "@prisma/client";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "../../config/config.service";
import { UsersService } from "../../users/users.service";
import { TokenPayload } from "../interfaces";

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.jwtAccessTokenSecret,
    });
  }

  public async validate(payload: TokenPayload): Promise<TokenPayload> {
    const user: User = await this.usersService.user(payload.sub);
    if (!user.refresh_token) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}