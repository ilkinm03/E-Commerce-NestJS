import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";

@Module({
  imports: [],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    PrismaService
  ],
})
export class OrdersModule {
}