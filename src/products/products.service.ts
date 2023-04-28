import { Injectable } from "@nestjs/common";
import { Product } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProductDto, UpdateProductDto } from "./dtos";

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  public async create(productDto: CreateProductDto): Promise<Product> {
    return this.prismaService.product.create({
      data: productDto,
    });
  }

  public async products(): Promise<Product[]> {
    return this.prismaService.product.findMany({});
  }

  public async product(id: number): Promise<Product> {
    return this.prismaService.product.findUnique({
      where: {
        id,
      },
    });
  }

  public async update(
    id: number,
    productDto: UpdateProductDto,
  ): Promise<Product> {
    return this.prismaService.product.update({
      where: {
        id,
      },
      data: productDto,
    });
  }
}