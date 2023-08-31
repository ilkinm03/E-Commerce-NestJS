import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePermissionDto {
  @ApiProperty({
    description: "Title of the permission",
    example: "read:any",
  })
  @IsNotEmpty()
  @IsString()
  title: string;
}