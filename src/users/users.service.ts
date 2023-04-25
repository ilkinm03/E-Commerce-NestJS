import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto, UpdateUserDto } from "./dtos";

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

  public async updateRefreshToken(
    id: number,
    refresh_token: string,
  ): Promise<User> {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        refresh_token: {
          set: refresh_token,
        },
      },
    });
  }

  public async removeRefreshToken(id: number): Promise<Prisma.BatchPayload> {
    return this.prismaService.user.updateMany({
      where: {
        id,
        refresh_token: {
          not: null,
        },
      },
      data: {
        refresh_token: null
      }
    })
  }

  public async delete(id: number): Promise<User> {
    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }

}