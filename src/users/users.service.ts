import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  ConflictException, forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma, Role, User } from "@prisma/client";
import { Cache } from "cache-manager";
import { v4 as uuidv4 } from "uuid";
import { GenericResponse } from "../common/api";
import { PrismaService } from "../prisma/prisma.service";
import { CreateGoogleUserDto, CreateUserDto, UpdateUserDto } from "./dtos";
import { RolesService } from "../roles/roles.service";

@Injectable()
export class UsersService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(forwardRef(() => RolesService)) private readonly rolesService: RolesService,
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

  public async user(guid: string): Promise<User> {
    const cachedUser: User = await this.cacheManager.get<User>(`user-${guid}`);
    if (cachedUser) {
      return cachedUser;
    }
    const user: User = await this.prismaService.user.findUnique({
      where: {
        guid,
      },
    });
    if (!user) {
      throw new NotFoundException("user not found");
    }
    await this.cacheManager.set(`user-${guid}`, user);
    return user;
  }

  public async create(userDto: CreateUserDto): Promise<GenericResponse> {
    const {
      roles,
      ...userData
    }: CreateUserDto = userDto;
    const isUserExists: GenericResponse = await this.prismaService.user.findUnique({
      where: {
        email: userData.email,
      },
    });
    if (isUserExists) {
      throw new ConflictException("user already exists");
    }
    const roleEntities: Role[] = await this.rolesService.getRolesById(roles);
    if (roleEntities.length !== userDto.roles.length) {
      throw new NotFoundException("role not found");
    }
    const user: User = await this.prismaService.user.create({
      data: {
        ...userData,
        guid: uuidv4(),
        roles: {
          create: roles.map((roleId: number) => (
            { role: { connect: { id: roleId } } }
          )),
        },
      },
    });
    return { guid: user.guid };
  }

  public async createGoogleUser(userDto: CreateGoogleUserDto): Promise<GenericResponse> {
    const user: User = await this.prismaService.user.create({
      data: {
        password: "",
        guid: uuidv4(),
        ...userDto,
      },
    });
    return { guid: user.guid };
  }

  public async update(id: number, userDto: UpdateUserDto): Promise<GenericResponse> {
    const user: User = await this.prismaService.user.update({
      where: {
        id,
      },
      data: userDto,
    });
    return { guid: user.guid };
  }

  public async updateRefreshToken(
    id: number,
    refresh_token: string,
  ): Promise<GenericResponse> {
    const user: User = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        refresh_token: {
          set: refresh_token,
        },
      },
    });
    return { guid: user.guid };
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

  public async delete(id: number): Promise<GenericResponse> {
    const user: User = await this.prismaService.user.delete({
      where: {
        id,
      },
    });
    return { guid: user.guid };
  }

  public async updateUserOrders(
    prisma: PrismaService,
    id: number,
    orderId: number,
  ): Promise<GenericResponse> {
    const user: User = await prisma.user.update({
      where: {
        id,
      },
      data: {
        orders: { connect: { id: orderId } },
      },
    });
    return { guid: user.guid };
  }
}