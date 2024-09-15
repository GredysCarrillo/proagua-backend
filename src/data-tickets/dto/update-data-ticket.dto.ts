import { PartialType } from '@nestjs/mapped-types';
import { CreateDataTicketDto } from './create-data-ticket.dto';

export class UpdateDataTicketDto extends PartialType(CreateDataTicketDto) {}
