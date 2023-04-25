import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { SignupDto } from "./dtos";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  public async signup(signupDto: SignupDto): Promise<User> {
    const {
      password,
      confirm_password,
      ...userData
    } = signupDto;
    if (password !== confirm_password) {
      throw new BadRequestException("passwords not match");
    }
    const hashedPassword: string = await bcrypt.hash(password, 10);
    const user: User = await this.usersService.create({
      password: hashedPassword,
      ...userData,
    });
    return user;
  }
}