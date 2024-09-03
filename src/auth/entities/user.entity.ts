import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema()
export class User {

    @Prop({required: true})
    name:string;

    @Prop({required: true, unique: true})
    dpi:number;

    @Prop({required: true})
    email: string;

    @Prop({required: true})
    dateOfBirth: Date;
    
    @Prop({required: true})
    phoneNumber: number;

}

export const UserSchema = SchemaFactory.createForClass(User);
