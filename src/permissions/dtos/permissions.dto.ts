import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class PermissionsDto {
  @ApiProperty({
    description: "Id of the permission",
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: "Title of the permission",
    example: "read:any",
  })
  @Expose()
  title: string;
}