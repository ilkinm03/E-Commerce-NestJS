import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class SignupDto {
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
  @Length(1, 30)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  confirm_password: string;
}