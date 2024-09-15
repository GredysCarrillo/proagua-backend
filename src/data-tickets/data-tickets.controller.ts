import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DataTicketsService } from './data-tickets.service';
import { CreateDataTicketDto } from './dto/create-data-ticket.dto';
import { UpdateDataTicketDto } from './dto/update-data-ticket.dto';

@Controller('data-tickets')
export class DataTicketsController {
  constructor(private readonly dataTicketsService: DataTicketsService) {}

  @Post('/create-ticket')
  create(@Body() createDataTicketDto: CreateDataTicketDto) {
    return this.dataTicketsService.createTicket(createDataTicketDto);
  }

  @Get()
  findAll() {
    return this.dataTicketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dataTicketsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDataTicketDto: UpdateDataTicketDto) {
    return this.dataTicketsService.update(+id, updateDataTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dataTicketsService.remove(+id);
  }
}
