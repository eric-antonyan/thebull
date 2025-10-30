import {Prop} from "@nestjs/mongoose";
import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateRequestDto {
    @IsNotEmpty()
    fullName: string;

    @IsNotEmpty()
    company: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    phoneNumber: string;

    @IsNotEmpty()
    country: string;

    @IsNotEmpty()
    address: string;

    accepted: boolean;
}