import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateDataTicketDto } from './dto/create-data-ticket.dto';
import { UpdateDataTicketDto } from './dto/update-data-ticket.dto';
import { dataTicket } from './entities/data-ticket.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class DataTicketsService {

  constructor(
    @InjectModel(dataTicket.name) private ticketModel: Model<dataTicket>
  ){}

  async createTicket(createDataTicketDto: CreateDataTicketDto):Promise<dataTicket> {
    try{
      const newTicket = new this.ticketModel(createDataTicketDto);
      await newTicket.save();
      console.log({newTicket});
      return newTicket;
    }catch(error){
      throw new InternalServerErrorException('No se creo el ticket', error);
    }
  }

  findAll() {
    return `This action returns all dataTickets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dataTicket`;
  }

  update(id: number, updateDataTicketDto: UpdateDataTicketDto) {
    return `This action updates a #${id} dataTicket`;
  }

  remove(id: number) {
    return `This action removes a #${id} dataTicket`;
  }
}
