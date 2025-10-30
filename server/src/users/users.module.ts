import {Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {User, UserSchema} from 'src/schemas/admin.schema';
import {JwtModule} from "@nestjs/jwt";
import {jwtConstants} from "./constants";
import {RequestSchema} from "../requests/requests.model";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema
            },
            {
                name: Request.name,
                schema: RequestSchema
            }
        ]),
        JwtModule.register({
            secret: jwtConstants.secret,
            global: true,
            signOptions: {
                expiresIn: '124h'
            }
        })
    ],
    providers: [UsersService],
    controllers: [UsersController]
})
export class UsersModule {
}
