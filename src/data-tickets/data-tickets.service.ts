import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

 async findById(userId:string): Promise<CreateDataTicketDto[]> {
    const tickets = await this.ticketModel.find({userId}).exec();
    
    if(!tickets || tickets.length === 0){
      throw new NotFoundException('Ningun ticket creado')
    } 
    return tickets;
  }














  
  findAll() {
    return `This action returns all dataTickets`;
  }


  update(id: number, updateDataTicketDto: UpdateDataTicketDto) {
    return `This action updates a #${id} dataTicket`;
  }

  remove(id: number) {
    return `This action removes a #${id} dataTicket`;
  }
}
