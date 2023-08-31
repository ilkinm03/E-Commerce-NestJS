import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { PermissionsDto } from "../../permissions/dtos";

export class RolesDto {
  @ApiProperty({
    description: "Id of the role",
    example: 1,
  })
  @Expose()
  id: number;

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
  @Transform(({ value }) => value?.map(p => (
    {
      id: p.permission.id,
      title: p.permission.title,
    }
  )))
  permisisons: PermissionsDto[];
}