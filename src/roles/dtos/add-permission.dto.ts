import { IsNotEmpty, IsNumber } from "class-validator";

export class AddPermissionDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  permissionId: number;
}