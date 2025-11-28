import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { CreateRequestDto } from "../dto/CreateRequest.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model, MongooseError } from "mongoose";
import { MongoError } from "mongodb";
import mongoose from "mongoose";
import { User } from "../schemas/admin.schema";
import { RequestDocument } from "./requests.model";

@Injectable()
export class RequestsService {
  constructor(
    @InjectModel(Request.name) private requestModel: Model<RequestDocument>,
    @InjectModel(User.name) private usersModel: Model<User>
  ) {}
  async create(dto: CreateRequestDto) {
    dto.accepted = false;
    const exist = await this.requestModel.findOne({
      $or: [{ email: dto.email }, { phoneNumber: dto.phoneNumber }],
    });

    if (!exist) {
      const request = await this.requestModel.create(dto);
    } else {
      throw new ConflictException({
        message: "Вы уже отправили запрос из этом email или номер телофена",
      });
    }
  }

  async getAll() {
    const requests = await this.requestModel.find();

    return requests;
  }

  async accept(requestId: string) {
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      throw new BadRequestException({ message: "Invalid ID" });
    }

    const request = await this.requestModel.findById(requestId);
    if (!request) {
      throw new NotFoundException({ message: "Not found" });
    }

    // Mark accepted
    await this.requestModel.updateOne({ _id: requestId }, { accepted: true });

    // ✔ GET RAW PASSWORD FROM REQUEST
    const hashedPassword = await bcrypt.hash(request.password, 12);
    console.log("[+]" ,request.password, hashedPassword);
    

    // ✔ CREATE USER
    await this.usersModel.create({
      fullName: request.fullName,
      company: request.company,
      phoneNumber: request.phoneNumber,
      email: request.email,
      country: request.country,
      city: request.city,
      address: request.address,
      profession: request.profession,
      passwordHash: hashedPassword,
    });

    return { message: "Заявка принята" };
  }

  async refuse(requestId: string) {
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      throw new BadRequestException({
        message: "Please enter a valid task ID.",
        errors: true,
      });
    }

    const request = await this.requestModel.findOne({ _id: requestId });

    if (!request) {
      throw new NotFoundException({
        message: "Заявка с таком ID не найдено",
      });
    }

    await this.requestModel.deleteOne({ _id: requestId });
    await this.usersModel.deleteOne({ _id: requestId });

    return {
      message: "Удалено",
    };
  }
}
