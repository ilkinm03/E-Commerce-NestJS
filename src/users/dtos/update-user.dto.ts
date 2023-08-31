import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Length } from "class-validator";

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: "First name of the user",
    minLength: 2,
    maxLength: 30,
  })
  @IsOptional()
  @IsString()
  @Length(2, 30)
  first_name?: string;

  @ApiPropertyOptional({
    description: "Last name of the user",
    minLength: 2,
    maxLength: 30,
  })
  @IsOptional()
  @IsString()
  @Length(2, 30)
  last_name?: string;
}