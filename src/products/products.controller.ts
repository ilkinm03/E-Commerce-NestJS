import { Body, Controller, Get, Post } from "@nestjs/common";
import { Product } from "@prisma/client";
import { Serialize } from "../common/decorators";
import { CreateProductDto, ProductDto } from "./dtos";
import { ProductsService } from "./products.service";

@Controller("products")
@Serialize(ProductDto)
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @Post()
  public async createProduct(@Body() productDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(productDto);
  }

  @Get()
  public async findProducts(): Promise<Product[]> {
    return this.productsService.products();
  }
}