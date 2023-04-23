import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  public async create(userDto): Promise<User> {
    userDto.password = await bcrypt.hash(userDto.password, 10);
    return this.prismaService.user.create({
      data: userDto,
    });
  }
}