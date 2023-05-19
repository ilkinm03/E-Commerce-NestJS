import { IsOptional, IsString, Length } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 30)
  first_name?: string;

  @IsOptional()
  @IsString()
  @Length(2, 30)
  last_name?: string;
}