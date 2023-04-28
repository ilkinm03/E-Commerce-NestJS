import {
  Body,
  Controller, Delete,
  Get, NotFoundException,
  Param,
  ParseIntPipe, Patch,
  Post,
} from "@nestjs/common";
import { Product } from "@prisma/client";
import { Serialize } from "../common/decorators";
import { CreateProductDto, ProductDto, UpdateProductDto } from "./dtos";
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

  @Get(":id")
  public async findProductById(@Param(
    "id",
    ParseIntPipe,
  ) id: number): Promise<Product> {
    return this.productsService.product(id);
  }

  @Patch(":id")
  public async updateProduct(
    @Param("id", ParseIntPipe) id: number,
    @Body() productDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, productDto);
  }

  @Delete(":id")
  public async deleteProduct(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<Product> {
    return this.productsService.delete(id);
  }
}