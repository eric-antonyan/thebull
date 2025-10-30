import {
    BadRequestException,
    Body,
    Controller, Delete,
    Get, NotFoundException,
    Param,
    Post, Res,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import { UploadsService } from "./uploads.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadFileDto } from "../dto/UploadFile.dto";
import { validate } from "class-validator";
import { diskStorage } from "multer";
import { extname } from "path";
import { createHash } from "crypto";
import { createReadStream } from "fs";
import { Response } from 'express';
import * as fs from "node:fs";

@Controller('uploads')
export class UploadsController {
    constructor(private readonly uploadService: UploadsService) {}

    @Post("")
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: "./images",
            filename: (req, file, cb) => {
              try {
                const fileExtName = extname(file.originalname);
                const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
                const hash = createHash('sha256')
                  .update(timestamp + file.originalname)
                  .digest('hex')
                  .slice(0, 32);
                const newFileName = `${timestamp}_${hash}${fileExtName}`;
                cb(null, newFileName);
              } catch (err) {
                cb(err, null);
              }
            }
        })
    }))
    public async upload(
        @UploadedFile() file: Express.Multer.File | undefined,
        @Body() dto: UploadFileDto
    ) {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.mimetype)) {
            throw new BadRequestException('File type must be either JPEG or PNG');
        }

        const errors = await validate(dto);
        if (errors.length > 0) {
            throw new BadRequestException(errors);
        }

        const savedFile: any = await this.uploadService.save(file, dto);

        return {
            message: "Image uploaded successfully",
            filename: savedFile.filename,
            hash: savedFile.hash,
            extension: savedFile.extension,
        };
    }

    @Get(":hash")
    public async getFile(
      @Param("hash") hash: string,
      @Res() res: Response
    ) {
      const file = await this.uploadService.getFile(hash);
    
      if (!file) {
        throw new NotFoundException(`File with hash ${hash} not found`);
      }
    
      const storedFileName = file.storedFilename || `${file.hash}.${file.extension}`;
      const filePath = `./images/${storedFileName}`;
    
      if (!fs.existsSync(filePath)) {
        throw new NotFoundException(`File not found on disk for hash ${hash}`);
      }
    
      const mimeType = this.getMimeType(file.extension);
    
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${file.filename}"`);
    
      const fileStream = createReadStream(filePath);
      return fileStream.pipe(res); // ✅ Send only file, no JSON
    }
    
    private getMimeType(ext: string): string {
      const types = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
        avif: 'image/avif',
      };
      return types[ext.toLowerCase()] || 'application/octet-stream';
    }

    @Delete(":id")
    async delete(@Param("id") id: string) {
        return this.uploadService.delete(id);
    }
}
