import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {

    _id?: string;

    @Prop({required: true})
    name:string;

    @Prop({required: true, unique: true})
    dpi:string;

    @Prop({required: true})  
    email: string;
    
    @Prop({required: true})
    phoneNumber: string;

    @Prop({required:true})
    password?:string;

    @Prop({default:true})
    isActive:boolean;

    @Prop({default: true})
    status:boolean;

    @Prop({ type: [String], default: ['user'] })
    roles: string[];

}   

export const UserSchema = SchemaFactory.createForClass(User);
