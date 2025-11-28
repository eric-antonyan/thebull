// src/users/users.service.ts
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CheckAdminDto } from "./dto/check-admin.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import mongoose from "mongoose";
import { User } from "../schemas/admin.schema";
import * as bcrypt from "bcryptjs";

const PRIMARY_ADMIN = {
  phoneNumber: "79999999999",
  password: "abuser",
};

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<any>,
    private jwt: JwtService
  ) {}

  // Логин по телефону и паролю
  async checkAdmin(dto: CheckAdminDto) {
    const { phoneNumber, password } = dto;

    const user = await this.userModel
      .findOne({ phoneNumber })
      .select("+passwordHash");

    if (!user) {
      throw new UnauthorizedException({ message: "Неверные данные" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      throw new UnauthorizedException({ message: "Неверные данные" });
    }

    const token = await this.jwt.signAsync({
      sub: user._id.toString(),
      phoneNumber: user.phoneNumber,
      role: "admin",
    });

    return {
      message: "Успешный вход",
      success: true,
      token,
    };
  }

  async getUser(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException({
        message: "Please enter a valid user ID.",
        errors: true,
      });
    }

    const user = await this.userModel.findById(id).select("-password");
    if (!user) {
      throw new NotFoundException({
        message: `User with ID ${id} not found.`,
      });
    }

    return user;
  }
}
