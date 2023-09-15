import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { PermissionsDto } from "../../permissions/dtos";

export class RolesDto {
  @ApiProperty({
    description: "Guid of the role",
  })
  @Expose()
  guid: string;

  @ApiProperty({
    description: "Title of the role",
    example: "USER",
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: "Array of permissions",
    type: [PermissionsDto],
  })
  @Expose()
  @Transform(({ value }) => PermissionsDto.transformEntity(value))
  permisisons: PermissionsDto[];
}