import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDataTicketDto } from './dto/create-data-ticket.dto';
import { UpdateDataTicketDto } from './dto/update-data-ticket.dto';
import { dataTicket } from './entities/data-ticket.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class DataTicketsService {

  constructor(
    @InjectModel(dataTicket.name) private ticketModel: Model<dataTicket>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }

  async createTicket(createDataTicketDto: CreateDataTicketDto): Promise<dataTicket> {
    try {
      if (createDataTicketDto.image) {
        createDataTicketDto.image = Buffer.from(createDataTicketDto.image);
      }
      const newTicket = new this.ticketModel(createDataTicketDto);
      await newTicket.save();
      return newTicket;
    } catch (error) {
      throw new InternalServerErrorException('No se creó el ticket', error);
    }
  }

  //buscar por Id
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

  async countTicketsActive(): Promise<any> {
    const Abiertos = await this.ticketModel.countDocuments({ status: 'Abierto' });
    return { Abiertos };
  }

  async findAll(): Promise<CreateDataTicketDto[]> {
    const tickets = await this.ticketModel
      .find()
      .sort({ createdAt: -1 })
      .exec();

    const userIds = [...new Set(tickets.map(ticket => ticket.userId))];
    const users = await this.userModel.find({ _id: { $in: userIds } }).exec();
    const userMap = new Map(users.map(user => [user._id.toString(), user.name]))

    return tickets.map(ticket => ({
      _id: ticket._id,
      problemType: ticket.problemType,
      description: ticket.description,
      photo: ticket.photo,
      userId: ticket.userId,
      status: ticket.status,
      CreatedAt: ticket.CreatedAt,
      image: ticket.image,
      userName: userMap.get(ticket.userId.toString()) || 'Desconocido',
    }))
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
