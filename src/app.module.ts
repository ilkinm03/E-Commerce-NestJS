import { Global, Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { PrismaClientExceptionFilter } from "../dist/common/filters";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from "./prisma/prisma.module";
import { PrismaService } from "./prisma/prisma.service";
import { UsersModule } from "./users/users.module";

@Global()
@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionFilter,
    }
  ],
  exports: [PrismaModule],
})
export class AppModule {}
