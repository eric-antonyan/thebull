import {Body, Controller, Get, Param, Post, Put} from '@nestjs/common';
import {CreateRequestDto} from "../dto/CreateRequest.dto";
import {RequestsService} from "./requests.service";

@Controller('requests')
export class RequestsController {
    constructor(
        private readonly requestsService: RequestsService
    ) {
    }
    @Post()
    create(@Body() dto: CreateRequestDto) {
        return this.requestsService.create(dto)
    }

    @Get("")
    getAll() {
        return this.requestsService.getAll()
    }

    @Put(":id/accept")
    accept(
        @Param("id") id: string
    ) {
        return this.requestsService.accept(id)
    }

    @Put(":id/refuse")
    refuse(
        @Param("id") id: string
    ) {
        return this.requestsService.refuse(id)
    }
}
