import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateOrderDto {
  @ApiProperty({
    description: "The payment method",
  })
  @IsOptional()
  @IsString()
  payment_method?: string;

  @ApiProperty({
    description: "The shipping method",
  })
  @IsOptional()
  @IsString()
  shipping_method?: string;

  @ApiProperty({
    description: "The array of product IDs",
    type: [Number],
    example: [1],
  })
  @IsArray()
  products: number[];
}