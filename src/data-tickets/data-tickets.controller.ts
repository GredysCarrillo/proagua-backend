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

  @Get('user/:userId')
  findById(@Param('userId') userId: string): Promise<CreateDataTicketDto[]> {
    return this.dataTicketsService.findById(userId);
  }

  @Get('/count-by-status')
  async countTicketsByStatus(){
    return this.dataTicketsService.countTicketByStatus();
  }

  @Get('/all-tickets')
  findAll() {
    return this.dataTicketsService.findAll();
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
