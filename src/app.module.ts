import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DataSerModule } from './data-ser/data-ser.module';

@Module({
  imports: [AuthModule,

    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME,
      connectionFactory: (connection) => {
        console.log('MongoDB connected:', connection.readyState);
        return connection;
      },
    }),
    DataSerModule,

  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
