import { IsOptional, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';

export class UploadFileDto {
    @IsOptional()
    @ValidateIf((obj) => obj.size !== undefined)
    @Transform(({ value }) => parseInt(value, 10))
    size: number;
}
