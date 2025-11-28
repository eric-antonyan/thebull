// src/dto/UpdateTask.dto.ts
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  priority?: string;
}
