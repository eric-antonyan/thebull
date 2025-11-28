// src/auth/dto/register-user.dto.ts
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsEmail()
  email: string;

  company?: string;
  country?: string;
  city?: string;
  address?: string;
  profession?: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
