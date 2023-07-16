import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from "class-validator";

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
  @Length(8, 40)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 40)
  confirm_password: string;

  @IsNotEmpty()
  @IsNumber({}, { each: true })
  roles: number[];
}