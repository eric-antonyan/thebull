import {BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import { CheckAdminDto } from './dto/check-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {JwtService} from "@nestjs/jwt";
import mongoose from "mongoose";
import {User} from "../schemas/admin.schema";

const adminDetails = {
    username: "sipan",
    password: "thebull$2024"
}

@Injectable()
class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwt: JwtService
    ) { }

    async checkAdmin(req: CheckAdminDto) {
        const { phoneNumber } = req;

        const isExists = await this.userModel.findOne({ phoneNumber });

        if (isExists) {
            const payload = isExists.toObject() ;
            const token = await this.jwt.signAsync(payload);
            return {
                message: "Вы успешно вошли в систему!",
                success: true,
                token,
            };
        } else {
            throw new HttpException({
                message: "Пожалуйста, введите правильные данные!",
                success: false
            }, HttpStatus.NOT_FOUND);
        }
    }

    async getUser(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestException({
                message: 'Please enter a valid user ID.',
                errors: true,
            });
        }

        try {
            const user = await this.userModel.findOne({ _id: id });

            if (!user) {
                throw new NotFoundException({
                    message: `User with ID ${id} not found.`,
                });
            }

            return user;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error; // Re-throwing the error to ensure it propagates
        }
    }



}

export { UsersService }