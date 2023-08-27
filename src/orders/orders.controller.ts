import {
  Body,
  Controller, Delete,
  Get,
  Param,
  ParseIntPipe, Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBody, ApiNotFoundResponse,
  ApiOkResponse, ApiParam,
  ApiServiceUnavailableResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Order } from "@prisma/client";
import { CurrentUser, Serialize } from "../common/decorators";
import { JwtAuthGuard } from "../common/guards";
import { CreateOrderDto, OrderDto, UpdateOrderDto } from "./dtos";
import { OrderOwnerGuard } from "./guards";
import { OrdersService } from "./orders.service";

@ApiTags("orders")
@UseGuards(JwtAuthGuard)
@Controller("orders")
@Serialize(OrderDto)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @ApiOkResponse({
    description: "Creates and returns the order",
    type: OrderDto,
  })
  @ApiServiceUnavailableResponse({
    description: "Order failed",
  })
  @ApiBody({ type: CreateOrderDto })
  @Post()
  public async createOrder(
    @CurrentUser("sub") userId: number,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    return this.ordersService.createOrderTransaction(userId, createOrderDto);
  }

  @ApiOkResponse({
    description: "Returns all the orders",
    type: [OrderDto],
  })
  @Get()
  public async getOrders(): Promise<Order[]> {
    return this.ordersService.getOrders();
  }

  @ApiOkResponse({
    description: "Cancels the placed order",
    type: OrderDto,
  })
  @ApiParam({
    description: "Id of the order",
    name: "id"
  })
  @UseGuards(OrderOwnerGuard)
  @Patch("cancel/:id")
  public async cancelOrder(@Param(
    "id",
    ParseIntPipe,
  ) id: number): Promise<Order> {
    return this.ordersService.cancelOrder(id);
  }

  @ApiOkResponse({
    description: "Returns an order with the provided id",
    type: OrderDto,
  })
  @ApiNotFoundResponse({
    description: "The order with the provided id not found",
  })
  @ApiParam({
    description: "Id of the order",
    name: "id"
  })
  @Get(":id")
  public async getOrder(@Param(
    "id",
    ParseIntPipe,
  ) id: number): Promise<Order> {
    return this.ordersService.getOrderById(id);
  }

  @ApiOkResponse({
    description: "Updates an order with the provided id",
    type: OrderDto,
  })
  @ApiParam({
    description: "Id of the order",
    name: "id"
  })
  @ApiBody({ type: UpdateOrderDto })
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