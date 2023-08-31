import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, Length, Max } from "class-validator";

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: "New title of the product",
    minLength: 5,
    maxLength: 64,
    example: "Updated title",
  })
  @IsOptional()
  @IsString()
  @Length(5, 64)
  title?: string;

  @ApiPropertyOptional({
    description: "New Description of the product",
    minLength: 5,
    maxLength: 128,
    example: "Updated description",
  })
  @IsOptional()
  @IsString()
  @Length(5, 128)
  description?: string;

  @ApiPropertyOptional({
    description: "New price of the product",
    maximum: 10000,
    example: 20,
  })
  @IsOptional()
  @IsNumber()
  @Max(10000)
  price?: number;
}