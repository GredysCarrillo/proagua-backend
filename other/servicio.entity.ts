import { NestFactory } from "@nestjs/core";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Date } from "mongoose";

@Schema()
export class proaguaService{

    @Prop({required:true})
    userId:string;

    @Prop({required:true})
    serviceAdress:string;

    @Prop({required:true})
    typeOfStableshment:string;

    @Prop({required:true})
    counterNumber:string;

    @Prop({required:true})
    startDate:Date
}

export const serviceSchema = SchemaFactory.createForClass(proaguaService); 