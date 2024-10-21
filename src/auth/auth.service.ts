import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { jwtPayload } from './interfaces/jwt-payload';
import { loginDto } from './dto/login.dto';
import { loginResponse } from './interfaces/login.response';
import * as nodemailer from 'nodemailer';
import { ChangePasswordDto } from './dto/chage-password.dto';


@Injectable()
export class AuthService {

  //Constructor
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtServive: JwtService,
  ) { }


  //metodo para crear un usuario
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const password = this.generatePassword(CreateUserDto.name, createUserDto.dpi);
      const passworddGenerated = bcryptjs.hashSync(password, 10);
      const { ...rest } = createUserDto;
      const newUser = new this.userModel({
        password: passworddGenerated,
        ...rest
      });
      await newUser.save();
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'anner123escobar@gmail.com',
          pass: 'wpkb kmbd jwjk xcqq',
        },
      });
      const mailOptions = {
        from: 'anner123escobar@gmail.com',
        to: createUserDto.email,
        subject: 'Cuenta creada con exito',
        text: `Su cuenta ha sido creada con exito, su contrasenia es ${password} y su usuario es ${createUserDto.dpi}`
      }

      await transporter.sendMail(mailOptions);
      const { password: _, ...user } = newUser.toJSON();
      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`Ya existe un usuario con este DPI:  ${createUserDto.dpi}`);
      }
      throw new InternalServerErrorException('Algo salio mal al intentar registrar el usuario', error);
    }
  }

  //metodo para loguearse
  async login(LoginDto: loginDto): Promise<loginResponse> {
    const { dpi, password } = LoginDto;
    const user = await this.userModel.findOne({ dpi });
    if (!user) {
      throw new UnauthorizedException('Not valid credentials - DPI no encontrado')
    }
    if (!bcryptjs.compareSync(password, user.password)) {
      console.log(LoginDto.password, LoginDto.dpi);
      throw new UnauthorizedException('Not valid credentiasl -password invalid')
    }
    const { password: _, ...rest } = user.toJSON();
    return {
      user: rest,
      token: this.getJwtToken({ id: user.id }),
    }
  }

  //Metodo para generar un token
  getJwtToken(payload: jwtPayload) {
    const token = this.jwtServive.sign(payload);
    return token;
  }

  // Método para generar la contraseña
  private generatePassword(dpi: string, name: string): string {
    const firstFourDigitsOfDpi = dpi.slice(0, 4); // Corregido a 4 dígitos
    const firstFourLettersOfName = name.slice(0, 4).toLowerCase(); // Corregido a 4 letras
    return `${firstFourDigitsOfDpi}${firstFourLettersOfName}`;
  }
  

  //Metodo para buscar por Id
  async findUserById(id: string) {
    const user = await this.userModel.findById(id);
    const { password, ...rest } = user.toJSON();
    return rest;
  }

  //Actualizar el usuario
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    const { password, ...rest } = user.toJSON();
    return rest; // Retorna el usuario sin la contraseña
  }

  //Buscar todos los usuarios
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async ChargeImage(userId: string, photo: string) {
    try {
      // Actualiza el usuario usando await
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        { photo }, // Aquí se actualiza el campo photo
        { new: true } // Opción para retornar el usuario actualizado
      );

      if (!updatedUser) {
        throw new Error('Usuario no encontrado');
      }

      return updatedUser;
    } catch (error) {
      console.error('Error actualizando la imagen del usuario:', error);
      throw new Error('No se pudo actualizar la imagen');
    }
  }

  //Metodo para eliminar
  remove(id: number) {
    return `This action removes a #${id} auth`;
  }


  ///mover hacia otro recurso de mongo

  async updateUserPhoto(userId: string, file: Express.Multer.File): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    user.photo = file.buffer;
    await user.save();
    return { message: 'Fotografía cargada correctamente', photo: user.photo };
  }

  // Método para obtener la fotografía del usuario por su ID
  async getFotoByUserId(userId: string): Promise<Buffer> {
    const user = await this.userModel.findById(userId);

    if (!user || !user.photo) {
      throw new NotFoundException('Fotografía no encontrada');
    }

    // Verificamos si `photo` es un Buffer, de lo contrario, lo convertimos
    if (!(user.photo instanceof Buffer)) {
      // Si es un `ArrayBuffer`, lo convertimos a `Buffer`
      return Buffer.from(user.photo);
    }

    return user.photo;  // Si ya es un Buffer, simplemente lo retornamos
  }


  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const isMatch = await bcryptjs.compare(changePasswordDto.currentPassword, user.password);
      if (!isMatch) {
        throw new BadRequestException('La contraseña actual es incorrecta');
      }

      if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
        throw new BadRequestException('Las contraseñas no coinciden');
      }

      const hashedNewPassword = await bcryptjs.hash(changePasswordDto.newPassword, 10);
      user.password = hashedNewPassword;
      console.log(user.password);
      console.log(hashedNewPassword);
      await user.save();

    } catch (error) {
      console.error(error); // Loguea el error para verificar en el servidor
      throw error; // Lanza una excepción más genérica
    }
  }


}