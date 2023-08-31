import { ApiProperty } from "@nestjs/swagger";
import { ITokens } from "../../interfaces";

export class TokensResponse implements ITokens {
  @ApiProperty({
    description: "Access Token",
  })
  accessToken: string;

  @ApiProperty({
    description: "Refresh Token",
  })
  refreshToken: string;
}