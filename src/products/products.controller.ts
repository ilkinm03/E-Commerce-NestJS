import {
  Body,
  Controller, Delete,
  Get,
  Param,
  ParseIntPipe, Patch,
  Post, UseGuards,
} from "@nestjs/common";
import { Product } from "@prisma/client";
import { Serialize } from "../common/decorators";
import { JwtAuthGuard } from "../common/guards";
import { CreateProductDto, ProductDto, UpdateProductDto } from "./dtos";
import { ProductsService } from "./products.service";

@Controller("products")
@Serialize(ProductDto)
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  public async updateProduct(
    @Param("id", ParseIntPipe) id: number,
    @Body() productDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, productDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  public async deleteProduct(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<Product> {
    return this.productsService.delete(id);
  }
}