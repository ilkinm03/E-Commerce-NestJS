import { Expose, Transform } from "class-transformer";
import { PermissionsDto } from "../../permissions/dtos";

export class RolesDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  @Transform(({ value }) => value?.map(p => (
    {
      id: p.permission.id,
      title: p.permission.title,
    }
  )))
  permisisons: PermissionsDto[];
}