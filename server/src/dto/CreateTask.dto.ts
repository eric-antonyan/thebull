import {IsArray, IsBoolean, IsNotEmpty, IsString, IsUUID} from "class-validator";

export class CreateTask {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsArray()
    @IsString({each: true})
    @IsNotEmpty()
    images: string[]

    @IsString()
    @IsNotEmpty()
    priority: string;


    @IsNotEmpty()
    @IsString()
    owner: string;
}