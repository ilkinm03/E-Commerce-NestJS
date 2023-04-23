import {
  INestApplication, Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit,
  OnModuleDestroy {
  constructor() {
    super();
  }

  public async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  public async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  public enableShutdownHooks(app: INestApplication): void {
    this.$on("beforeExit", async (): Promise<void> => {
      await app.close();
    });
  }
}