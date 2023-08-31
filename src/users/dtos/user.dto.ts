import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class UserDto {
  @ApiProperty({
    description: "Id of the user",
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: "First name of the user",
    example: "John",
  })
  @Expose()
  first_name: string;

  @ApiProperty({
    description: "Last name of the user",
    example: "Doe",
  })
  @Expose()
  last_name: string;

  @ApiProperty({
    description: "Email of the user",
    example: "john@example.com",
  })
  @Expose()
  email: string;
}