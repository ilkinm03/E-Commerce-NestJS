import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateOrderDto {
  @ApiPropertyOptional({
    description: "Updated order payment method",
  })
  @IsOptional()
  @IsString()
  payment_method?: string;

  @ApiPropertyOptional({
    description: "Updated order shipping method",
  })
  @IsOptional()
  @IsString()
  shipping_method?: string;
}