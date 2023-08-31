import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from "class-validator";

export class CreateProductDto {
  @ApiProperty({
    description: "Title of the product",
    minLength: 5,
    maxLength: 64,
    example: "T-Shirt",
  })
  @IsNotEmpty()
  @IsString()
  @Length(5, 64)
  title: string;

  @ApiProperty({
    description: "Description of the product",
    minLength: 5,
    maxLength: 128,
    example: "Red S-size Men T-Shirt",
  })
  @IsNotEmpty()
  @IsString()
  @Length(5, 128)
  description: string;

  @ApiProperty({
    description: "Price of the product",
    maximum: 10000,
    example: 20,
  })
  @IsNotEmpty()
  @IsNumber()
  @Max(10000)
  price: number;
}