import { Expose } from "class-transformer";

type ProductEntity = { product: ProductDto };

export class ProductDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  public static transformEntity(entity: ProductEntity[]): ProductDto[] {
    return entity.map((value: ProductEntity): ProductDto => (
      {
        id: value.product.id,
        title: value.product.title,
        description: value.product.description,
        price: value.product.price,
      }
    ));
  }
}