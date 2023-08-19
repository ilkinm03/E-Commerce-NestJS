import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { Order, Prisma, Product } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { ProductsService } from "../products/products.service";
import { UsersService } from "../users/users.service";
import { OrderStatuses } from "./constants";
import { CreateOrderDto, UpdateOrderDto } from "./dtos";

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
  ) {}

  public async getOrders(): Promise<Order[]> {
    const includeProducts: Prisma.OrderInclude = {
      products: {
        include: { product: true },
      },
    };
    return this.prismaService.order.findMany({
      include: includeProducts,
    });
  }

  public async getOrderById(id: number): Promise<Order> {
    const order: Order = await this.prismaService.order.findUnique({
      where: { id },
    });
    if (!order) {
      throw new NotFoundException("order not found");
    }
    return order;
  }

  public async cancelOrder(id: number): Promise<Order> {
    const order: Order = await this.getOrderById(id);
    const nonCancellableOrderStatuses: OrderStatuses[] = [
      OrderStatuses.SHIPPED,
      OrderStatuses.DELIVERED,
    ];
    if (nonCancellableOrderStatuses.includes(order.order_status as OrderStatuses)) {
      throw new BadRequestException("cannot cancel the order at this point");
    }
    try {
      return await this.prismaService.order.update({
        where: { id },
        data: { order_status: OrderStatuses.CANCELED },
      });
    } catch (error) {
      throw new ServiceUnavailableException("cannot cancel the order");
    }
  }

  public async updateOrder(
    orderId: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    await this.getOrderById(orderId);
    return this.prismaService.order.update({
      where: { id: orderId },
      data: updateOrderDto,
    });
  }

  public async deleteOrder(id: number): Promise<Order> {
    await this.getOrderById(id);
    return this.prismaService.order.delete({
      where: { id },
    });
  }

  public async createOrderTransaction(
    userId: number,
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    const { products }: CreateOrderDto = createOrderDto;
    return this.prismaService.$transaction(async (prisma: PrismaService): Promise<Order> => {
      try {
        const createdOrder: Order = await this.createOrder(
          prisma,
          userId,
          createOrderDto,
        );
        const orderTotalPrice: number = await this.calculateOrderTotalPrice(
          products);
        await this.updateOrderTotalPrice(
          prisma,
          createdOrder.id,
          orderTotalPrice,
        );
        await this.usersService.updateUserOrders(
          prisma,
          userId,
          createdOrder.id,
        );
        await Promise.all(
          products.map((productId: number) => prisma.productsOnOrder.create({
            data: {
              product: { connect: { id: productId } },
              order: { connect: { id: createdOrder.id } },
            },
          })),
        );
        return createdOrder;
      } catch (error) {
        throw new ServiceUnavailableException("failed to create order");
      }
    });
  }

  private async createOrder(
    prisma: PrismaService,
    userId: number,
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    const {
      products,
      ...createOrderData
    }: CreateOrderDto = createOrderDto;
    const orderCreateData: Prisma.OrderCreateInput = {
      ...createOrderData,
      order_no: Date.now().toString(),
      user: { connect: { id: userId } },
    };
    return prisma.order.create({
      data: orderCreateData,
    });
  }

  private async updateOrderTotalPrice(
    prisma: PrismaService,
    orderId: number,
    totalPrice: number,
  ): Promise<void> {
    await prisma.order.update({
      where: { id: orderId },
      data: { total_price: totalPrice },
    });
  }

  private async calculateOrderTotalPrice(productIds: number[]): Promise<number> {
    const products: Product[] = await this.productsService.getProductsByIds(
      productIds);
    return products.reduce(
      (totalPrice: number, product: Product) => totalPrice + product.price,
      0,
    );
  }

}