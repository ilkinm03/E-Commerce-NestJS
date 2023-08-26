import { IsOptional, IsString } from "class-validator";

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  payment_method?: string;

  @IsOptional()
  @IsString()
  shipping_method?: string;
}