import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  payment_method?: string;

  @IsOptional()
  @IsString()
  shipping_method?: string;

  @IsArray()
  products: number[];
}