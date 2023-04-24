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
}