import { CacheModule } from "@nestjs/cache-manager";
import { Global, Module, ValidationPipe } from "@nestjs/common";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { PrismaClientExceptionsFilter } from "./common/filters";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "./config/config.module";
import { OrdersModule } from "./orders/orders.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ProductsModule } from "./products/products.module";
import { UsersModule } from "./users/users.module";

@Global()
@Module({
  imports: [
    PrismaModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    AuthModule,
    ConfigModule,
    CacheModule.register({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionsFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
  exports: [PrismaModule],
})
export class AppModule {
}
