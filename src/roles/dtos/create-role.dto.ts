import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateRoleDto {
  @ApiProperty({
    description: "Title of the role",
    example: "USER",
  })
  @IsNotEmpty()
  @IsString()
  public readonly title: string;
}