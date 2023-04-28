import { Body, Controller, Post } from "@nestjs/common";
import { Product } from "@prisma/client";
import { CreateProductDto } from "./dtos";
import { ProductsService } from "./products.service";

@Controller("products")
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @Post()
  public async createProduct(@Body() productDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(productDto);
  }
}