import {IsArray, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class UpdateTaskDto {
    @IsString()
    @IsOptional()
    title?: string;


    @IsString()
    @IsOptional()
    description?: string;

    @IsString({each: true})
    images?: []

    @IsString()
    @IsOptional()
    priority?: string;
}