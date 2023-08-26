import {
  Body,
  Controller, Delete,
  Get,
  Param,
  ParseIntPipe, Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Order } from "@prisma/client";
import { CurrentUser, Serialize } from "../common/decorators";
import { JwtAuthGuard } from "../common/guards";
import { CreateOrderDto, OrderDto, UpdateOrderDto } from "./dtos";
import { OrderOwnerGuard } from "./guards";
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

  @UseGuards(OrderOwnerGuard)
  @Patch("cancel/:id")
  public async cancelOrder(@Param(
    "id",
    ParseIntPipe,
  ) id: number): Promise<Order> {
    return this.ordersService.cancelOrder(id);
  }

  @Get(":id")
  public async getOrder(@Param(
    "id",
    ParseIntPipe,
  ) id: number): Promise<Order> {
    return this.ordersService.getOrderById(id);
  }

  @Patch(":id")
  public async updateOrder(
    @Param("id", ParseIntPipe) orderId: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.updateOrder(orderId, updateOrderDto);
  }

  @Delete(":id")
  public async deleteOrder(@Param(
    "id",
    ParseIntPipe,
  ) id: number): Promise<Order> {
    return this.ordersService.deleteOrder(id);
  }
}