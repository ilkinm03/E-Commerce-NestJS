import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe, Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Order } from "@prisma/client";
import { CurrentUser, Serialize } from "../common/decorators";
import { JwtAuthGuard } from "../common/guards";
import { CreateOrderDto, OrderDto } from "./dtos";
import { OrdersService } from "./orders.service";

@UseGuards(JwtAuthGuard)
@Controller("orders")
@Serialize(OrderDto)
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

  @Patch("/cancel/:id")
  public async cancelOrder(@Param(
    "id",
    ParseIntPipe,
  ) id: number, @CurrentUser("sub") userId: number): Promise<Order> {
    return this.ordersService.cancelOrder(id, userId);
  }
}