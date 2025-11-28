import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Upload } from "../schemas/uploads.schema";
import { UploadFileDto } from "../dto/UploadFile.dto";
import * as fs from "fs";
import * as path from "path";
import { createHash } from "crypto";

@Injectable()
export class UploadsService {
  constructor(
    @InjectModel(Upload.name) private readonly uploadModel: Model<Upload>
  ) {}

  async save(file: Express.Multer.File, dto: UploadFileDto): Promise<Upload> {
    const { originalname, mimetype, filename, path: filePath } = file;

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException("Uploaded file not found on disk");
    }

    // Extract the hash from filename created by Multer
    // Example: 20251028T223344_abcdef1234567890abcd1234567890.png
    const match = filename.match(/_(\w{32})/);
    const hash = match
      ? match[1]
      : createHash("sha256").update(filename).digest("hex").slice(0, 32);
    const fileExtName = path.extname(filename).replace(".", "");

    const uploadPath = `./images/${filename}`;

    const upload = new this.uploadModel({
      filename: originalname,
      hash,
      extension: fileExtName,
      path: uploadPath,
      storedFilename: filename,
    });

    return await upload.save();
  }

  async getFile(hash: string): Promise<Upload | undefined> {
    return this.uploadModel.findOne({ hash });
  }

  async delete(id: string) {
    const file = await this.uploadModel.findOne({ hash: id });

    if (!file) {
      throw new NotFoundException({
        message: "File not found",
      });
    }

    const filePath = path.join("./images", `${file.storedFilename}`);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.uploadModel.deleteOne({ hash: id });

    return { message: "File deleted successfully" };
  }
}