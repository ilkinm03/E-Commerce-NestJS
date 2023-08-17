import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { Order, Prisma, Product } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { ProductsService } from "../products/products.service";
import { UsersService } from "../users/users.service";
import { CreateOrderDto } from "./dtos";

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
  ) {}

  public async getOrders(): Promise<Order[]> {
    return this.prismaService.order.findMany();
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