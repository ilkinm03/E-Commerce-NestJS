import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class PermissionsDto {
  @ApiProperty({
    description: "Guid of the permission",
  })
  @Expose()
  guid: string;

  @ApiProperty({
    description: "Title of the permission",
    example: "read:any",
  })
  @Expose()
  title: string;
}