import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common';
import {CreateRequestDto} from "../dto/CreateRequest.dto";
import {InjectModel} from "@nestjs/mongoose";
import {Model, MongooseError} from "mongoose"
import {MongoError} from "mongodb";
import mongoose from "mongoose";
import {User} from "../schemas/admin.schema";

@Injectable()
export class RequestsService {
    constructor(
        @InjectModel(Request.name) private requestModel: Model<Request>,
        @InjectModel(User.name) private usersModel: Model<User>
    ) {
    }
    async create(dto: CreateRequestDto) {
        dto.accepted = false
        const exist = await this.requestModel.findOne({
            $or: [
                { email: dto.email },
                { phoneNumber: dto.phoneNumber }
            ]
        });


        if (!exist) {
            const request = await this.requestModel.create(dto);

        } else {
            throw new ConflictException({
                message: "Вы уже отправили запрос из этом email или номер телофена"
            })
        }
    }

    async getAll() {
        const requests = await this.requestModel.find();

        return requests;
    }

    async accept(requestId: string) {
        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            throw new BadRequestException({
                message: 'Please enter a valid task ID.',
                errors: true,
            });
        }

        const request = await this.requestModel.findOne({_id: requestId});

        if (!request) {
            throw new NotFoundException({
                message: "Заявка с таком ID не найдено"
            })
        }

        await this.requestModel.updateOne({_id: requestId}, {
            accepted: true
        })

        const requestObject = request.toObject();

        delete requestObject._id;

        await this.usersModel.create(requestObject);

        return {
            message: "Заяавка принято"
        }
    }

    async refuse(requestId: string) {
        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            throw new BadRequestException({
                message: 'Please enter a valid task ID.',
                errors: true,
            });
        }

        const request = await this.requestModel.findOne({_id: requestId});

        if (!request) {
            throw new NotFoundException({
                message: "Заявка с таком ID не найдено"
            })
        }

        await this.requestModel.deleteOne({_id: requestId})
        await this.usersModel.deleteOne({_id: requestId})

        return {
            message: "Удалено"
        }
    }
}
