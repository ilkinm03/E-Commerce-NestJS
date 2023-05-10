import { Injectable } from "@nestjs/common";
import { Order, Product } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOrderDto } from "./dtos";

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
}