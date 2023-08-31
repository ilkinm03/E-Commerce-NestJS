import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({
    description: "Email of the user",
    example: "test@test.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Password of the user",
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}