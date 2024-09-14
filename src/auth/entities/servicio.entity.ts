import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema()
export class proaguaService{

    @Prop({required:true})
    _Id:string;

    @Prop({required:true})
    Address:string;

    @Prop({required:true})
    Colonia:string;
    
    @Prop({required:true})
    serviceType:string;

    }

export const serviceSchema = SchemaFactory.createForClass(proaguaService); 