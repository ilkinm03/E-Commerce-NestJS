import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  payment_method?: string;

  @IsOptional()
  @IsNumber()
  transaction_id: number;

  @IsOptional()
  @IsString()
  shipping_method?: string;

  @IsOptional()
  @IsString()
  order_status?: string;

  @IsOptional()
  @IsArray()
  products?: number[];

  @IsOptional()
  @IsNumber()
  total_price?: number;
}