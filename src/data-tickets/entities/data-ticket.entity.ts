import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";


@Schema()
export class dataTicket {
    
    @Prop({required:true})
    problemType: string;

    @Prop({required:true})
    description: string;

    @Prop()
    photo: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId; 
  
    @Prop({ type: Types.ObjectId, ref: 'Service', required: true })
    serviceId: Types.ObjectId;

    @Prop({required:true})
    status:string;

    @Prop({default: Date.now})
    CreatedAt:Date;

}

export const ticketsSchema = SchemaFactory.createForClass(dataTicket)
