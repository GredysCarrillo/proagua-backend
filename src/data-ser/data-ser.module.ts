import { Module } from '@nestjs/common';
import { DataSerService } from './data-ser.service';
import { DataSerController } from './data-ser.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { proaguaService, serviceSchema } from './entities/servicio.entity';

@Module({
  controllers: [DataSerController],
  providers: [DataSerService],
  imports:[   

    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: proaguaService.name, schema: serviceSchema }
    ]),
  ]
})
export class DataSerModule {}
