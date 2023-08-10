import { IsNotEmpty, IsString } from "class-validator";

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsString()
  title: string;
}