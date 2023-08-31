import {
  Body,
  Controller, Delete,
  Get,
  Param,
  ParseIntPipe, Patch,
  Post, UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody, ApiCreatedResponse, ApiNotFoundResponse,
  ApiOkResponse, ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { Product } from "@prisma/client";
import { Serialize } from "../common/decorators";
import { JwtAuthGuard } from "../common/guards";
import { CreateProductDto, ProductDto, UpdateProductDto } from "./dtos";
import { ProductsService } from "./products.service";

@ApiTags("products")
@Controller("products")
@Serialize(ProductDto)
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @ApiBearerAuth("jwt-access")
  @ApiCreatedResponse({
    description: "Creates and returns the product",
    type: ProductDto,
  })
  @ApiBody({
    type: CreateProductDto,
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  public async createProduct(@Body() productDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(productDto);
  }

  @ApiOkResponse({
    description: "Returns all the products",
    type: [ProductDto],
  })
  @Get()
  public async findProducts(): Promise<Product[]> {
    return this.productsService.products();
  }

  @ApiOkResponse({
    description: "Returns a product with the provided id",
    type: ProductDto,
  })
  @ApiNotFoundResponse({
    description: "The product with the provided id not found",
  })
  @ApiParam({
    description: "Id of the product",
    name: "id",
  })
  @Get(":id")
  public async findProductById(@Param(
    "id",
    ParseIntPipe,
  ) id: number): Promise<Product> {
    return this.productsService.product(id);
  }

  @ApiBearerAuth("jwt-access")
  @ApiOkResponse({
    description: "Updates and returns the product",
    type: ProductDto,
  })
  @ApiNotFoundResponse({
    description: "The product with the provided id not found",
  })
  @ApiBody({
    type: UpdateProductDto,
  })
  @ApiParam({
    description: "Id of the product",
    name: "id",
  })
  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  public async updateProduct(
    @Param("id", ParseIntPipe) id: number,
    @Body() productDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, productDto);
  }

  @ApiBearerAuth("jwt-access")
  @ApiOkResponse({
    description: "Deletes and returns the product",
    type: ProductDto,
  })
  @ApiNotFoundResponse({
    description: "The product with the provided id not found",
  })
  @ApiParam({
    description: "Id of the product",
    name: "id",
  })
  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  public async deleteProduct(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<Product> {
    return this.productsService.delete(id);
  }
}