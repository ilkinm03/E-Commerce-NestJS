import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  payment_method?: string;

  @IsOptional()
  @IsNumber()
  transaction_id?: number;

  @IsOptional()
  @IsString()
  shipping_method?: string;

  @IsOptional()
  @IsString()
  order_status?: string;

  @IsArray()
  products: number[];

  @IsNotEmpty()
  @IsNumber()
  total_price: number;
}