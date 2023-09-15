import {
  Body,
  Controller, Delete,
  Get, HttpCode, HttpStatus,
  Param,
  ParseIntPipe, Patch,
  Post,
  Query, UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody, ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse, ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { User } from "@prisma/client";
import { GenericResponse } from "../common/api";
import { Serialize } from "../common/decorators";
import { JwtAuthGuard } from "../common/guards";
import {
  CreateUserDto,
  UpdateUserDto,
  UserDto,
} from "./dtos";
import { UsersService } from "./users.service";

@ApiBearerAuth("jwt-access")
@ApiTags("users")
@Controller("/users")
@Serialize(UserDto)
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @ApiOkResponse({
    description: "Returns all the users",
    isArray: true,
    type: UserDto,
  })
  @ApiQuery({
    description: "Email of the user",
    name: "email",
    required: false,
  })
  @Get()
  public async findAllUsers(@Query("email") email?: string): Promise<User[]> {
    return this.usersService.users(email);
  }

  @ApiOkResponse({
    description: "Returns a user with the provided id",
    type: UserDto,
  })
  @ApiNotFoundResponse({
    description: "User with the provided id not found",
  })
  @ApiParam({
    description: "Id of the user",
    name: "id",
  })
  @Get(":guid")
  public async findUserById(@Param("guid") guid: string): Promise<User> {
    return this.usersService.user(guid);
  }

  @ApiOkResponse({
    description: "Creates and returns the user",
    type: UserDto,
  })
  @ApiConflictResponse({
    description: "User with the provided email already exists",
  })
  @ApiBody({
    type: CreateUserDto,
  })
  @Post()
  public async createUser(@Body() userDto: CreateUserDto): Promise<GenericResponse> {
    return this.usersService.create(userDto);
  }

  @ApiOkResponse({
    description: "Updates and returns the updated user",
    type: UserDto,
  })
  @ApiNotFoundResponse({
    description: "User with the provided id not found"
  })
  @ApiConflictResponse({
    description: "User with the provided email already exists",
  })
  @ApiBody({
    type: UpdateUserDto,
  })
  @ApiParam({
    description: "Id of the user",
    name: "id",
  })
  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  public async updateUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() userDto: UpdateUserDto,
  ): Promise<GenericResponse> {
    return this.usersService.update(id, userDto);
  }

  @ApiOkResponse({
    description: "Deletes a user with the provided id",
    type: UserDto,
  })
  @ApiNotFoundResponse({
    description: "User with the provided id not found",
  })
  @ApiParam({
    description: "Id of the user",
    name: "id",
  })
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  public async deleteUser(@Param(
    "id",
    ParseIntPipe,
  ) id: number): Promise<GenericResponse> {
    return this.usersService.delete(id);
  }
}