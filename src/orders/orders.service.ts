import { Injectable } from "@nestjs/common";
import { Order, Product } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOrderDto, UpdateOrderDto } from "./dtos";

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  public async create(
    userId: number,
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    const {
      products,
      ...rest
    }: CreateOrderDto = createOrderDto;
    const productRecords: Product[] = await this.prismaService.product.findMany(
      {
        where: {
          id: { in: products },
        },
      });
    return this.prismaService.order.create({
      data: {
        ...rest,
        order_no: Date.now(),
        user: { connect: { id: userId } },
        products: {
          connect: productRecords.map((product: Product): { id: number } => (
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
    const productRecords: Product[] = await this.prismaService.product.findMany(
      {
        where: {
          id: { in: products },
        },
      });
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
}