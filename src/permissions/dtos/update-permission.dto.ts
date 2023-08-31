import { IsNotEmpty, IsString } from "class-validator";

export class UpdatePermissionDto {
  @IsNotEmpty()
  @IsString()
  title: string;
}