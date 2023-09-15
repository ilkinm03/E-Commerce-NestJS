import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class UserDto {
  @ApiProperty({
    description: "Guid of the user",
  })
  @Expose()
  guid: string;

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