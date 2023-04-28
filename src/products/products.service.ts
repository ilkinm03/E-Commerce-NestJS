import { Injectable } from "@nestjs/common";
import { Product } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProductDto } from "./dtos";

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
}