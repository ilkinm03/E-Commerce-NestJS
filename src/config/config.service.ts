import { Injectable } from "@nestjs/common";
import { ConfigService as NestConfigService } from "@nestjs/config";

@Injectable()
export class ConfigService {
  constructor(
    private readonly nestConfigService: NestConfigService,
  ) {}

  public get nodeEnv(): string {
    return this.nestConfigService.get<string>("NODE_ENV");
  }

  public get dbUrl(): string {
    return this.nestConfigService.get<string>("DATABASE_URL");
  }

  public get jwtAccessTokenSecret(): string {
    return this.nestConfigService.get<string>("JWT_ACCESS_TOKEN_SECRET");
  }

  public get jwtRefreshTokenSecret(): string {
    return this.nestConfigService.get<string>("JWT_REFRESH_TOKEN_SECRET");
  }

  public get jwtAccessTokenExp(): number {
    return this.nestConfigService.get<number>("JWT_ACCESS_TOKEN_EXP_TIME");
  }

  public get jwtRefreshTokenExp(): number {
    return this.nestConfigService.get<number>("JWT_REFRESH_TOKEN_EXP_TIME");
  }

  public get googleOauthClientId(): string {
    return this.nestConfigService.get<string>("GOOGLE_OAUTH_CLIENT_ID");
  }

  public get googleOauthClientSecert(): string {
    return this.nestConfigService.get<string>("GOOGLE_OAUTH_CLIENT_SECRET");
  }

  public get googleOauthCallbackUrl(): string {
    return this.nestConfigService.get<string>("GOOGLE_OAUTH_CALLBACK_URL");
  }
}