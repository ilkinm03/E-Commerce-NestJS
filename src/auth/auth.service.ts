import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Permission, Role, User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { ConfigService } from "../config/config.service";
import { PermissionsService } from "../users/roles/permissions.service";
import { RolesService } from "../users/roles/roles.service";
import { UsersService } from "../users/users.service";
import { LoginDto, SignupDto } from "./dtos";
import { ITokens, TokenPayload } from "./interfaces";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly permissionsService: PermissionsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async signup(signupDto: SignupDto): Promise<ITokens> {
    const {
      password,
      confirm_password,
      ...userData
    }: SignupDto = signupDto;
    if (password !== confirm_password) {
      throw new BadRequestException("passwords not match");
    }
    const hashedPassword: string = await bcrypt.hash(password, 10);
    const user: User = await this.usersService.create({
      password: hashedPassword,
      ...userData,
    });
    const { permissions: userPermissions } = await this.getRolesAndPermissions(
      user.id);
    const tokens: ITokens = await this.getTokens({
      sub: user.id,
      email: user.email,
      permissions: userPermissions.map(p => p.title),
    });
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  public async login(loginDto: LoginDto): Promise<ITokens> {
    const [user]: User[] = await this.usersService.users(loginDto.email);
    if (!user) {
      throw new BadRequestException("email or password is wrong");
    }
    const isPasswordsMatching: boolean = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordsMatching) {
      throw new BadRequestException("email or password is wrong");
    }
    const { permissions: userPermissions } = await this.getRolesAndPermissions(
      user.id);
    const tokens: ITokens = await this.getTokens({
      sub: user.id,
      email: user.email,
      permissions: userPermissions.map(p => p.title),
    });
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  public async logout(userId: number): Promise<void> {
    await this.usersService.removeRefreshToken(userId);
  }

  public async refresh(userId: number, refreshToken: string): Promise<ITokens> {
    const user: User = await this.usersService.user(userId);
    if (!user || !user.refresh_token) {
      throw new BadRequestException("credentials are incorrect");
    }
    const isRtMatches: boolean = await bcrypt.compare(
      refreshToken,
      user.refresh_token,
    );
    if (!isRtMatches) {
      throw new BadRequestException("credentials are incorrect");
    }
    const { permissions: userPermissions } = await this.getRolesAndPermissions(
      user.id);
    const tokens: ITokens = await this.getTokens({
      sub: user.id,
      email: user.email,
      permissions: userPermissions.map(p => p.title),
    });
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  private async getTokens(payload: TokenPayload): Promise<ITokens> {
    const [accessToken, refreshToken]: [string, string] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.jwtAccessTokenExp * 60,
        secret: this.configService.jwtAccessTokenSecret,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.jwtRefreshTokenExp * 60,
        secret: this.configService.jwtRefreshTokenSecret,
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken: string = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(userId, hashedRefreshToken);
  }

  private async getRolesAndPermissions(userId: number): Promise<{
    roles: Role[],
    permissions: Permission[]
  }> {
    const roles: Role[] = await this.rolesService.getRolesByUserId(userId);
    const permissions: Permission[] = await this.permissionsService.getPermissionsByRoleIds(
      roles.map(r => r.id));
    return {
      roles,
      permissions,
    };
  }
}