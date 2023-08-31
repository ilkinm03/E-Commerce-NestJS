import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty, IsNumber,
  IsString,
  Length,
} from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    description: "First name of the user",
    minLength: 1,
    maxLength: 30,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  first_name: string;

  @ApiProperty({
    description: "Last name of the user",
    minLength: 1,
    maxLength: 30,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  last_name: string;

  @ApiProperty({
    description: "Email address of the user",
    minLength: 1,
    maxLength: 40,
  })
  @IsNotEmpty()
  @IsEmail()
  @Length(1, 40)
  email: string;

  @ApiProperty({
    description: "Password of the user",
    minLength: 8,
    maxLength: 40,
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 40)
  password: string;

  @ApiProperty({
    description: "Role list of the user",
    uniqueItems: true,
  })
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  roles: number[];
}