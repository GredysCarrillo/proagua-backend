import { PartialType } from '@nestjs/mapped-types';
import { CreateDataTicketDto } from './create-data-ticket.dto';
import { IsString } from 'class-validator';

export class UpdateDataTicketDto extends PartialType(CreateDataTicketDto) {

    @IsString()
    status: string;

}