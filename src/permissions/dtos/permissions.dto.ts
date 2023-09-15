import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

type PermissionsEntity = { permission?: PermissionsDto };

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

  public static transformEntity(entity: PermissionsEntity[]): PermissionsDto[] {
    return entity?.map((value: PermissionsEntity): PermissionsDto => (
      {
        guid: value.permission.guid,
        title: value.permission.title,
      }
    )) ?? [];
  }
}