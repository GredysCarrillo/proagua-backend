import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { DataTicketsService } from './data-tickets.service';
import { CreateDataTicketDto } from './dto/create-data-ticket.dto';
import { UpdateDataTicketDto } from './dto/update-data-ticket.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('data-tickets')
export class DataTicketsController {
  constructor(private readonly dataTicketsService: DataTicketsService) {}

  @Post('/create-ticket')
  @UseInterceptors(FileInterceptor('photo')) // 'photo' es el nombre del campo del archivo en el formulario
  async create(
    @UploadedFile() file: Express.Multer.File, // Aquí recibimos el archivo
    @Body() createDataTicketDto: CreateDataTicketDto,
  ) {
    if (file) {
      // Si hay un archivo, lo convertimos a Buffer
      createDataTicketDto.image = file.buffer; // Guardamos el buffer de la imagen en el DTO
    }
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

  @Get('/count-active-ticket')
  async countTicketsActive(){
    return this.dataTicketsService.countTicketsActive();
  }

  @Get('/all-tickets')
  findAll() {
    return this.dataTicketsService.findAll();
  }

  @Patch('/update-status/:id')
  update(@Param('id') ticketId: string, @Body() updateDataTicketDto: UpdateDataTicketDto) {
    return this.dataTicketsService.updateTicketStatus(ticketId, updateDataTicketDto.status);
  }








  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dataTicketsService.remove(+id);
  }
}
