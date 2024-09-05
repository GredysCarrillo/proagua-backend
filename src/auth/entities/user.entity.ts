import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Date } from "mongoose";

@Schema()
export class User {

    @Prop({required: true})
    name:string;

    @Prop({required: true, unique: true})
    dpi:number;

    @Prop({required: true})  
    email: string;
    
    @Prop({required: true})
    phoneNumber: number;

    @Prop({required:true})
    password?:string;

    @Prop({type: [String], default: 'user'})
    rol: string[];

}   

export const UserSchema = SchemaFactory.createForClass(User);
