import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from "class-validator";

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 64)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 128)
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Max(10000)
  price: number;
}