import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { User } from "@prisma/client";
import { CreateUserDto } from "./dtos";
import { UsersService } from "./users.service";

@Controller("/users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  public async findAllUsers(@Query("email") email?: string): Promise<User[]> {
    return this.usersService.users(email);
  }

  @Post()
  public async createUser(@Body() userDto: CreateUserDto): Promise<User> {
    return this.usersService.create(userDto);
  }
}