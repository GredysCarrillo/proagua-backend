import { IsDate, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateDataTicketDto {

    @IsString()
    problemType: string;

    @IsString()
    description: string;

    @IsString()
    userId: Types.ObjectId;

    @IsString()
    serviceId: Types.ObjectId;

    @IsString()
    status: string;

    @IsDate()
    CreatedAt: Date;

}
