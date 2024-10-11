import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DataSerService } from './data-ser.service';
import { UpdateDataSerDto } from './dto/update-data-ser.dto';
import { createServiceDto } from './dto/create-service.dto';
import { CreateDataTicketDto } from 'src/data-tickets/dto/create-data-ticket.dto';

@Controller('data')
export class DataSerController {
  constructor(private readonly dataSerService: DataSerService) {}

  @Post('/createService')
  createService(@Body() createService: createServiceDto){
    return this.dataSerService.createService(createService);
  }


  @Get('servicio/:userId')
  gerServicieByUserId(@Param('userId') userId: string){
    return this.dataSerService.findByUserId(userId);
  }

























  @Get()
  findAll() {
    return this.dataSerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dataSerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDataSerDto: UpdateDataSerDto) {
    return this.dataSerService.update(+id, updateDataSerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dataSerService.remove(+id);
  }
}
