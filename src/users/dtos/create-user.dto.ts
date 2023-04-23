import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  first_name: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(1, 40)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 40)
  password: string;
}