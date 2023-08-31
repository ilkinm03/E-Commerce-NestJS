import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateGoogleUserDto {
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
    description: "Email of the user",
    minLength: 1,
    maxLength: 40,
  })
  @IsNotEmpty()
  @IsEmail()
  @Length(1, 40)
  email: string;

  @ApiProperty({
    description: "Name of the provider",
    minLength: 1,
    maxLength: 30,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  provider: string;

  @ApiProperty({
    description: "Id of the provider",
    minLength: 1,
    maxLength: 30,
  })
  @IsNotEmpty()
  @IsString()
  provided_id: string;
}