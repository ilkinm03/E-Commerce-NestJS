import { IsNotEmpty, IsNumber } from "class-validator";

export class RemovePermissionDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  permissionId: number;
}