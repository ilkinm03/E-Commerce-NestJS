import {
  Body,
  Controller, Get, Param, ParseIntPipe, Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Order } from "@prisma/client";
import { CurrentUser } from "../common/decorators";
import { JwtAuthGuard } from "../common/guards";
import { CreateOrderDto, UpdateOrderDto } from "./dtos";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  public async createOrder(
    @CurrentUser("sub") userId: number,
    @Body() createOrderDto: CreateOrderDto
  ): Promise<Order> {
    return this.ordersService.create(userId, createOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  public async getOrders(): Promise<Order[]> {
    return this.ordersService.orders();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  public async getOrder(
    @Param("id", ParseIntPipe) userId: number,
  ): Promise<Order> {
    return this.ordersService.order(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  public async updateOrder(
    @Param("id", ParseIntPipe) userId: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.update(userId, updateOrderDto);
  }
}