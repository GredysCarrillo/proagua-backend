import { Module } from '@nestjs/common';
import { DataTicketsService } from './data-tickets.service';
import { DataTicketsController } from './data-tickets.controller';
import { dataTicket, ticketsSchema } from './entities/data-ticket.entity';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  controllers: [DataTicketsController],
  providers: [DataTicketsService],
  imports:[   

    ConfigModule.forRoot(),
   MongooseModule.forFeature([
      { name: dataTicket.name, schema: ticketsSchema}
    ]),
  ]
})
export class DataTicketsModule {}
