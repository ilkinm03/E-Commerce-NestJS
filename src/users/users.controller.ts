import {
  Body,
  Controller, Delete,
  Get, HttpCode, HttpStatus,
  Param,
  ParseIntPipe, Patch,
  Post,
  Query,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { Serialize } from "../common/decorators";
import {
  CreateUserDto,
  UserDto
} from "./dtos";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UsersService } from "./users.service";

@Controller("/users")
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  public async findAllUsers(@Query("email") email?: string): Promise<User[]> {
    return this.usersService.users(email);
  }

  @Get(":id")
  public async findUserById(@Param(
    "id",
    ParseIntPipe,
  ) id: number): Promise<User> {
    return this.usersService.user(id);
  }

  @Post()
  public async createUser(@Body() userDto: CreateUserDto): Promise<User> {
    return this.usersService.create(userDto);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  public async updateUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() userDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, userDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  public async deleteUser(@Param(
    "id",
    ParseIntPipe,
  ) id: number): Promise<User> {
    return this.usersService.delete(id);
  }
}