import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Product } from "@prisma/client";
import { Cache } from "cache-manager";
import { v4 as uuidv4 } from "uuid";
import { GenericResponse } from "../common/api";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProductDto, UpdateProductDto } from "./dtos";

@Injectable()
export class ProductsService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly prismaService: PrismaService,
  ) {}

  public async create(productDto: CreateProductDto): Promise<GenericResponse> {
    const product: Product = await this.prismaService.product.create({
      data: {
        ...productDto,
        guid: uuidv4(),
      },
    });
    return { guid: product.guid };
  }

  public async products(): Promise<GenericResponse[]> {
    const cachedProducts: Product[] = await this.cacheManager.get<Product[]>(
      "products");
    if (cachedProducts) {
      return cachedProducts;
    }
    const products: GenericResponse[] = await this.prismaService.product.findMany({
      select: {
        guid: true,
      },
    });
    await this.cacheManager.set("products", products);
    return products;
  }

  public async product(guid: string): Promise<Product> {
    const cachedProduct: Product = await this.cacheManager.get<Product>(`product-${guid}`);
    if (cachedProduct) {
      return cachedProduct;
    }
    const product: Product = await this.prismaService.product.findUnique({
      where: {
        guid,
      },
    });
    if (!product) {
      throw new NotFoundException("product not found");
    }
    await this.cacheManager.set(`product-${guid}`, product);
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
    guid: string,
    productDto: UpdateProductDto,
  ): Promise<Product> {
    return this.prismaService.product.update({
      where: {
        guid,
      },
      data: productDto,
    });
  }

  public async delete(guid: string): Promise<GenericResponse> {
    const product: GenericResponse = await this.product(guid);
    try {
      await this.prismaService.product.delete({
        where: { guid },
      });
      return product;
    } catch (error) {
      throw new UnprocessableEntityException("cannot delete the product");
    }
  }
}