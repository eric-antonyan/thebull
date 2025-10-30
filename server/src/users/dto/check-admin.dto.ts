import { IsNotEmpty } from "class-validator"

export class CheckAdminDto {
    @IsNotEmpty()
    phoneNumber: string;
}