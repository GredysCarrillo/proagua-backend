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
  ) { }

  async createTicket(createDataTicketDto: CreateDataTicketDto): Promise<dataTicket> {
    try {
      const newTicket = new this.ticketModel(createDataTicketDto);
      await newTicket.save();
      console.log({ newTicket });
      return newTicket;
    } catch (error) {
      throw new InternalServerErrorException('No se creo el ticket', error);
    }
  }

  async findById(userId: string): Promise<CreateDataTicketDto[]> {
    const tickets = await this.ticketModel.find({ userId }).exec();

    if (!tickets || tickets.length === 0) {
      throw new NotFoundException('Ningun ticket creado')
    }
    return tickets;
  }

  async countTicketByStatus(): Promise<any> {
    const abiertos = await this.ticketModel.countDocuments({ status: 'Abierto' });
    const enProceso = await this.ticketModel.countDocuments({ status: 'En Proceso' });
    const cerrados = await this.ticketModel.countDocuments({ status: 'Cerrado' });

    return { abiertos, enProceso, cerrados };
  }

  async countTicketsActive(): Promise<any>{
    const Abiertos = await this.ticketModel.countDocuments({status: 'Abierto'});
    return {Abiertos};
  }

  async findAll(): Promise<CreateDataTicketDto[]> {
    return this.ticketModel
      .find()
      .sort({ createdAt: -1 });
  }


  async updateTicketStatus(ticketId: string, status: string): Promise<UpdateDataTicketDto> {

    const updateTicket = await this.ticketModel.findByIdAndUpdate(
      ticketId,
      { status },
      { new: true }
    ).exec();

    if (!updateTicket) {
      throw new Error(`El ticket con el id: ${ticketId}, no fue encontrado`);
    }
    return updateTicket;
  }



  remove(id: number) {
    return `This action removes a #${id} dataTicket`;
  }
}
