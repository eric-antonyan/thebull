import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateRequestDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  company: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  city: string; 

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  profession: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  confirmPassword: string;

  accepted?: boolean;
}
