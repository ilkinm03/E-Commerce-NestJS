import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class AddPermissionDto {
  @ApiProperty({
    description: "Id of the role",
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({
    description: "Id of the permission",
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  permissionId: number;
}