import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Order } from "@prisma/client";
import { CurrentUser } from "../common/decorators";
import { JwtAuthGuard } from "../common/guards";
import { CreateOrderDto } from "./dtos";
import { OrdersService } from "./orders.service";

@UseGuards(JwtAuthGuard)
@Controller("orders")
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @Post()
  public async createOrder(
    @CurrentUser("sub") userId: number,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    return this.ordersService.createOrderTransaction(userId, createOrderDto);
  }

  @Get()
  public async getOrders(): Promise<Order[]> {
    return this.ordersService.getOrders();
  }

  @Get(":id")
  public async getOrder(@Param(
    "id",
    ParseIntPipe,
  ) id: number): Promise<Order> {
    return this.ordersService.getOrderById(id);
  }
}