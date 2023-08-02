import { IsNotEmpty, IsString } from "class-validator";

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  public readonly title: string;
}