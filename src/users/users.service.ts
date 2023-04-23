import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dtos";
import { UpdateUserDto } from "./dtos/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  public async users(email?: string): Promise<User[]> {
    return this.prismaService.user.findMany({
      where: {
        email,
      },
    });
  }

  public async user(id: number): Promise<User> {
    const user: User = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException("user not found");
    }
    return user;
  }

  public async create(userDto: CreateUserDto): Promise<User> {
    userDto.password = await bcrypt.hash(userDto.password, 10);
    return this.prismaService.user.create({
      data: userDto,
    });
  }

  public async update(id: number, userDto: UpdateUserDto): Promise<User> {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: userDto,
    });
  }

  public async delete(id: number): Promise<User> {
    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }
}