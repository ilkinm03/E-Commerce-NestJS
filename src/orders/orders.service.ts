import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { Order, Product } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { ProductsService } from "../products/products.service";
import { UsersService } from "../users/users.service";
import { CreateOrderDto, UpdateOrderDto } from "./dtos";

type OrderData = Omit<CreateOrderDto, "products"> & {
  userId: number,
  productRecords: Product[]
};

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  public async create(
    userId: number,
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    const {
      products,
      ...rest
    }: CreateOrderDto = createOrderDto;
    const productRecords: Product[] = await this.productsService.getProductsByIds(
      products);
    const orderData: OrderData = {
      userId,
      productRecords,
      ...rest,
    };
    const order: Order = await this.prismaService.$transaction(
      async (prisma: Partial<PrismaService>): Promise<Order> => {
        const createdOrder: Order = await this.createOrder(prisma, orderData);
        if (!createdOrder) {
          throw new ServiceUnavailableException(
            "the transaction cannot be fulfilled");
        }
        await this.usersService.updateUserOrders(userId, order.id);
        return createdOrder;
      });
    return order;
  }

  public async createOrder(
    prisma: Partial<PrismaService>,
    orderData: OrderData,
  ): Promise<Order> {
    const {
      userId,
      productRecords,
      ...rest
    }: OrderData = orderData;
    return prisma.order.create({
      data: {
        ...rest,
        order_no: Date.now().toString(),
        user: { connect: { id: userId } },
        products: {
          connect: productRecords.map((product: Product): {
            id: number
          } => (
            { id: product.id }
          )),
        },
      },
    });
  }

  public async orders(): Promise<Order[]> {
    return this.prismaService.order.findMany({});
  }

  public async order(id: number): Promise<Order> {
    return this.prismaService.order.findUnique({
      where: {
        id,
      },
    });
  }

  public async update(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const {
      products,
      ...rest
    }: UpdateOrderDto = updateOrderDto;
    const productRecords: Product[] = await this.productsService.getProductsByIds(
      products);
    return this.prismaService.order.update({
      where: {
        id,
      },
      data: {
        ...rest,
        products: {
          connect: productRecords.map((product: Product): { id: number } => (
            { id: product.id }
          )),
        },
      },
    });
  }

  public async delete(id: number): Promise<Order> {
    return this.prismaService.order.delete({
      where: {
        id,
      },
    });
  }
}