import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { ProductDto } from "../../products/dtos";

export class OrderDto {
  @ApiProperty({
    description: "Id of the order",
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: "Products included inside the order",
    type: [ProductDto],
  })
  @Expose()
  @Transform(({ value }) => ProductDto.transformEntity(value))
  products: ProductDto[];

  @ApiProperty({
    description: "The number of the order",
    example: 1234567890,
  })
  @Expose()
  order_no: string;

  @ApiProperty({
    description: "Total price of the order",
    example: 100,
  })
  @Expose()
  total_price: number;

  @ApiProperty({
    description: "Id of the order owner (user)",
    example: 1,
  })
  @Expose()
  userId: number;

  @ApiProperty({
    description: "The payment method",
    examples: ["CASH", "MASTERCARD", "VISA", "PAYPAL"],
  })
  @Expose()
  payment_method?: string;

  @ApiProperty({
    description: "The status of the payment",
    examples: ["PENDING", "SUCCESSFUL", "FAILED"],
  })
  @Expose()
  payment_status: string;

  @ApiProperty({
    description: "Id of the transaction",
  })
  @Expose()
  transaction_id?: number;

  @ApiProperty({
    description: "The shipping method",
  })
  @Expose()
  shipping_method?: string;

  @ApiProperty({
    description: "The tracking number of the order",
  })
  @Expose()
  tracking_number?: string;

  @ApiProperty({
    description: "The status of the order",
    examples: ["IN PROGRESS", "PREPARING", "ON WAY", "DELIVERED"],
  })
  @Expose()
  order_status: string;

  @ApiProperty({
    description: "The order date",
  })
  @Expose()
  order_date: Date;

  @ApiProperty({
    description: "The order delivery date",
  })
  @Expose()
  delivery_date?: Date;
}