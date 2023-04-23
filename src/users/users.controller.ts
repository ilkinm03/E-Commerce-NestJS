import { Controller, Get, Post } from "@nestjs/common";

@Controller("/users")
export class UsersController {
  @Get()
  public findAllUsers() {
    return "users";
  }

  @Post()
  public async createUser(): Promise {

  }
}