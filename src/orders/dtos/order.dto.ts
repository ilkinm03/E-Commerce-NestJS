import { Expose, Transform } from "class-transformer";
import { ProductDto } from "../../products/dtos";

export class OrderDto {
  @Expose()
  id: number;

  @Expose()
  @Transform(({ value }) => ProductDto.transformEntity(value))
  products: ProductDto[];

  @Expose()
  order_no: string;

  @Expose()
  total_price: number;

  @Expose()
  userId: number;

  @Expose()
  payment_method?: string;

  @Expose()
  payment_status: string;

  @Expose()
  transaction_id?: number;

  @Expose()
  shipping_method?: string;

  @Expose()
  tracking_number?: string;

  @Expose()
  order_status: string;

  @Expose()
  order_date: Date;

  @Expose()
  delivery_date?: Date;
}