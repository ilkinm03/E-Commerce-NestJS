import { IsNumber, IsOptional, IsString, Length, Max } from "class-validator";

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @Length(5, 64)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(5, 128)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Max(10000)
  price?: number;
}