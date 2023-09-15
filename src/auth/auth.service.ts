import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Permission, Role, User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { GenericResponse } from "../common/api";
import { ConfigService } from "../config/config.service";
import { IGoogleUser } from "../users/interfaces";
import { PermissionsService } from "../permissions/permissions.service";
import { RolesService } from "../roles/roles.service";
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
    const user: GenericResponse = await this.usersService.create({
      password: hashedPassword,
      ...userData,
    });
    const userDetails: Partial<User> = await this.usersService.user(user.guid);
    const { permissions: userPermissions } = await this.getRolesAndPermissions(
      user.guid);
    const tokens: ITokens = await this.getTokens({
      sub: userDetails.guid,
      email: userDetails.email,
      permissions: userPermissions.map(p => p.title),
    });
    await this.updateRefreshToken(userDetails.id, tokens.refreshToken);
    return tokens;
  }

  public async login(loginDto: LoginDto): Promise<ITokens> {
    const [user]: GenericResponse[] = await this.usersService.users(loginDto.email);
    if (!user) {
      throw new BadRequestException("email or password is wrong");
    }
    const userDetails: User = await this.usersService.user(user.guid);
    const isPasswordsMatching: boolean = await bcrypt.compare(
      loginDto.password,
      userDetails.password,
    );
    if (!isPasswordsMatching) {
      throw new BadRequestException("email or password is wrong");
    }
    const { permissions: userPermissions } = await this.getRolesAndPermissions(
        userDetails.guid);
    const tokens: ITokens = await this.getTokens({
      sub: userDetails.guid,
      email: userDetails.email,
      permissions: userPermissions.map(p => p.title),
    });
    await this.updateRefreshToken(userDetails.id, tokens.refreshToken);
    return tokens;
  }

  public async logout(userId: number): Promise<void> {
    await this.usersService.removeRefreshToken(userId);
  }

  public async refresh(userGuid: string, refreshToken: string): Promise<ITokens> {
    const user: GenericResponse = await this.usersService.user(userGuid);
    if (!user) {
      throw new BadRequestException("credentials are incorrect");
    }
    const userDetails: User = await this.usersService.user(user.guid);
    if (!userDetails.refresh_token) {
      throw new BadRequestException("credentials are incorrect");
    }
    const isRtMatches: boolean = await bcrypt.compare(
      refreshToken,
      userDetails.refresh_token,
    );
    if (!isRtMatches) {
      throw new BadRequestException("credentials are incorrect");
    }
    const { permissions: userPermissions } = await this.getRolesAndPermissions(userDetails.guid);
    const tokens: ITokens = await this.getTokens({
      sub: userDetails.guid,
      email: userDetails.email,
      permissions: userPermissions.map(p => p.title),
    });
    await this.updateRefreshToken(userDetails.id, tokens.refreshToken);
    return tokens;
  }

  public async googleLogin(user: IGoogleUser): Promise<ITokens> {
    const [existingUser]: GenericResponse[] = await this.usersService.users(user.email);
    if (existingUser) {
      const userDetails: User = await this.usersService.user(existingUser.guid);
      const tokens: ITokens = await this.getTokens({
        sub: userDetails.guid,
        email: userDetails.email,
        permissions: [],
      });
      await this.updateRefreshToken(userDetails.id, tokens.refreshToken);
      return tokens;
    }
    const createdUser: GenericResponse = await this.usersService.createGoogleUser({
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      provider: "google",
      provided_id: user.providedId,
    });
    const userDetails: User = await this.usersService.user(createdUser.guid);
    const tokens: ITokens = await this.getTokens({
      sub: userDetails.guid,
      email: userDetails.email,
      permissions: [],
    });
    await this.updateRefreshToken(userDetails.id, tokens.refreshToken);
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

  private async getRolesAndPermissions(userGuid: string): Promise<{
    roles: Role[],
    permissions: Permission[]
  }> {
    const roles: Role[] = await this.rolesService.getRolesByUserGuid(userGuid);
    const permissions: Permission[] = await this.permissionsService.getPermissionsByRoleGuids(
      roles.map(r => r.guid));
    return {
      roles,
      permissions,
    };
  }
}