import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Product } from "@prisma/client";
import { Cache } from "cache-manager";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProductDto, UpdateProductDto } from "./dtos";

@Injectable()
export class ProductsService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly prismaService: PrismaService,
  ) {}

  public async create(productDto: CreateProductDto): Promise<Product> {
    return this.prismaService.product.create({
      data: productDto,
    });
  }

  public async products(): Promise<Product[]> {
    const cachedProducts: Product[] = await this.cacheManager.get<Product[]>(
      "products");
    if (cachedProducts) {
      return cachedProducts;
    }
    const products: Product[] = await this.prismaService.product.findMany({});
    await this.cacheManager.set("products", products);
    return products;
  }

  public async product(id: number): Promise<Product> {
    const cachedProduct: Product = await this.cacheManager.get<Product>(`product-${id}`);
    if (cachedProduct) {
      return cachedProduct;
    }
    const product: Product = await this.prismaService.product.findUnique({
      where: {
        id,
      },
    });
    if (!product) {
      throw new NotFoundException("product not found");
    }
    await this.cacheManager.set(`product-${id}`, product);
    return product;
  }

  public async getProductsByIds(products: number[]): Promise<Product[]> {
    return this.prismaService.product.findMany(
      {
        where: {
          id: { in: products },
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

  public async delete(id: number): Promise<Product> {
    const product: Product = await this.product(id);
    try {
      await this.prismaService.product.delete({
        where: { id },
      });
      return product;
    } catch (error) {
      throw new UnprocessableEntityException("cannot delete the product");
    }
  }
}