import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

type ProductEntity = { product?: ProductDto };

export class ProductDto {
  @ApiProperty({
    description: "Guid of the product",
  })
  @Expose()
  guid: string;

  @ApiProperty({
    description: "Title of the product",
    example: "T-shirt",
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: "Description of the product",
    example: "Blue cotton T-shirt",
  })
  @Expose()
  description: string;

  @ApiProperty({
    description: "Price of the product",
    example: 20,
  })
  @Expose()
  price: number;

  public static transformEntity(entity: ProductEntity[]): ProductDto[] {
    return entity?.map((value: ProductEntity): ProductDto => (
      {
        guid: value.product.guid,
        title: value.product.title,
        description: value.product.description,
        price: value.product.price,
      }
    )) ?? [];
  }
}