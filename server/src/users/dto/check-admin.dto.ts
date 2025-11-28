// src/users/dto/check-admin.dto.ts
import { IsNotEmpty, MinLength, MaxLength } from "class-validator"

export class CheckAdminDto {
  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(64)
  password: string;
}
