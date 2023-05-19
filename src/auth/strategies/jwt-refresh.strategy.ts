import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { ConfigService } from "../../config/config.service";
import { TokenPayload } from "../interfaces";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.jwtRefreshTokenSecret,
      passReqToCallback: true,
    });
  }

  public validate(req: Request, payload: TokenPayload): TokenPayload & {
    refreshToken: string
  } {
    const refreshToken: string = req.get("authorization")
      .replace("Bearer ", "")
      .trim();
    return {
      refreshToken,
      ...payload,
    };
  }
}