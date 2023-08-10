import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { Cache } from "cache-manager";
import { PrismaService } from "../prisma/prisma.service";
import { CreateGoogleUserDto, CreateUserDto, UpdateUserDto } from "./dtos";

@Injectable()
export class UsersService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly prismaService: PrismaService,
  ) {}

  public async users(email?: string): Promise<User[]> {
    const cachedUsers: User[] = await this.cacheManager.get<User[]>("users");
    if (cachedUsers) {
      return cachedUsers;
    }
    const users: User[] = await this.prismaService.user.findMany({
      where: {
        email,
      },
    });
    await this.cacheManager.set("users", users);
    return users;
  }

  public async user(id: number): Promise<User> {
    const cachedUser: User = await this.cacheManager.get<User>(`user-${id}`);
    if (cachedUser) {
      return cachedUser;
    }
    const user: User = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException("user not found");
    }
    await this.cacheManager.set(`user-${id}`, user);
    return user;
  }

  public async create(userDto: CreateUserDto): Promise<User> {
    return this.prismaService.user.create({
      data: userDto,
    });
  }

  public async createGoogleUser(userDto: CreateGoogleUserDto): Promise<User> {
    return this.prismaService.user.create({
      data: {
        password: "",
        ...userDto,
      },
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
        refresh_token: null,
      },
    });
  }

  public async delete(id: number): Promise<User> {
    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }

  public async updateUserOrders(
    prisma: PrismaService,
    id: number,
    orderId: number,
  ): Promise<User> {
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        orders: { connect: { id: orderId } },
      },
    });
  }
}