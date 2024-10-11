import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

export class CreateDataTicketDto {

    @IsString()
    problemType: string;

    @IsString()
    description: string;

    @IsString()
    userId: string;

    @IsString()
    status: string;

    @Type(() => Date)
    @IsDate()
    CreatedAt: Date;

    @IsOptional()
    image?: Buffer;
    
}
