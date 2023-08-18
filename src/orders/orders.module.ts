import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ProductsService } from "../products/products.service";
import { UsersService } from "../users/users.service";
import { OrderOwnerGuard } from "./guards";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";

@Module({
  imports: [],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    PrismaService,
    UsersService,
    ProductsService,
    OrderOwnerGuard,
  ],
})
export class OrdersModule {
}