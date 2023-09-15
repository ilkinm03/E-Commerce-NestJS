import { ApiProperty } from "@nestjs/swagger";

export class GenericResponse {
    @ApiProperty({
        description: "GUID of the entity",
    })
    guid: string;
}