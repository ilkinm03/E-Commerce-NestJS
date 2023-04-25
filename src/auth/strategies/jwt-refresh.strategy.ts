import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { TokenPayload } from "../interfaces";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "jwt-refresh-secret",
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