import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateDataSerDto } from './dto/update-data-ser.dto';
import { proaguaService } from './entities/servicio.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createServiceDto } from './dto/create-service.dto';

@Injectable()
export class DataSerService {

  constructor(
    @InjectModel( proaguaService.name) private serviceModel: Model<proaguaService>,
  ){}

   //Metodo para crear un servicio
   async createService(createService: createServiceDto): Promise<proaguaService> {
    try {
      const newService = new this.serviceModel(createService);
      await newService.save();
      return newService;
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el servicio', error)
    }
  }

  async findByUserId(_Id:string): Promise<createServiceDto[]>{
    try{
      const services = await this.serviceModel.find({ _Id }).exec();
      if (!services || services.length === 0) {
        throw new InternalServerErrorException('No se encontraron servicios para este usuario');
      }
      return services;
    }catch(error){
      throw new InternalServerErrorException('Error al obtener el servicio', error)
    }
  }



  


  findAll() {
    return 'this actions return all services'
  }

  findOne(id: number) {
    return `This action returns a #${id} dataSer`;
  }

  update(id: number, updateDataSerDto: UpdateDataSerDto) {
    return `This action updates a #${id} dataSer`;
  }

  remove(id: number) {
    return `This action removes a #${id} dataSer`;
  }
}
