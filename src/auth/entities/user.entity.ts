import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as bcryptjs from 'bcryptjs'; // Asegúrate de que esto esté importado

@Schema()
export class User {

    _id?: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    dpi: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    phoneNumber: string;

    @Prop({ required: true })
    password?: string;

    @Prop({ type: Buffer })
    photo?: Buffer;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: true })
    status: boolean;

    @Prop({ type: [String], default: ['user'] })
    roles: string[];

}

export const UserSchema = SchemaFactory.createForClass(User);

// Middleware para hashear la contraseña antes de guardar
/* UserSchema.pre('save', async function (next) {
    const user = this as any;

    // Solo hashear si la contraseña ha sido modificada
    if (user.isModified('password')) {
        try {
            user.password = await bcryptjs.hash(user.password, 10); // Hashea de forma asíncrona si se modifica la contraseña
        } catch (error) {
            return next(error);
        }
    }

    next();
}); */
/* 
// Método para comparar la contraseña
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcryptjs.compare(password, this.password);
}; */

