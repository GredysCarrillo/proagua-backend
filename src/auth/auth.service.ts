
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
import { dataTicket } from 'src/data-tickets/entities/data-ticket.entity';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs'; // Para guardar el PDF en el sistema de archivos


@Injectable()
export class AuthService {

  //Constructor
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(dataTicket.name) private ticketModel: Model<dataTicket>,
    private jwtServive: JwtService,
  ) { }


  // Método para crear un usuario
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const password = this.generateRandomPassword();
      const passworddGenerated = bcryptjs.hashSync(password, 10);
      const { ...rest } = createUserDto;
      const newUser = new this.userModel({
        password: passworddGenerated,
        ...rest
      });
      await newUser.save();

      // Generar el PDF
      const doc = new PDFDocument();
      const pdfFilePath = `./${createUserDto.dpi}_user_info.pdf`;
      doc.pipe(fs.createWriteStream(pdfFilePath));

      // Estilos mejorados para el PDF
      doc
        .fontSize(25)
        .fillColor('#003366') // Encabezado de color oscuro
        .text('Cuenta creada con éxito', { align: 'center' })
        .moveDown();

      // Información de usuario con un estilo mejorado
      doc
        .fontSize(15)
        .fillColor('#003366')
        .text('Información de Usuario', { underline: true, align: 'center' })
        .moveDown(1);

      // Caja alrededor de los detalles de usuario
      doc
        .rect(70, 180, 450, 160) // Coordenadas y tamaño de la caja
        .strokeColor('#cccccc') // Color del borde
        .lineWidth(1)
        .stroke();

      doc
        .fontSize(12)
        .fillColor('black')
        .text(`Usuario: `, 80, 190, { continued: true })
        .fillColor('#333333')
        .text(`${createUserDto.dpi}`);

      doc
        .fillColor('black')
        .text(`Contraseña: `, 80, 210, { continued: true })
        .fillColor('#333333')
        .text(`${password}`);

      doc
        .fillColor('black')
        .text(`Nombre: `, 80, 230, { continued: true })
        .fillColor('#333333')
        .text(`${createUserDto.name}`);

      doc
        .fillColor('black')
        .text(`DPI: `, 80, 250, { continued: true })
        .fillColor('#333333')
        .text(`${createUserDto.dpi}`);

      doc.end();

      // Enviar el correo con el PDF adjunto
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
        subject: 'Cuenta creada con éxito',
        text: 'Su cuenta ha sido creada con éxito. Adjunto encontrará los detalles.',
        attachments: [
          {
            filename: `${createUserDto.dpi}_user_info.pdf`,
            path: pdfFilePath, // Ruta del PDF generado
          },
        ],
      };
      await transporter.sendMail(mailOptions);
      const { password: _, ...user } = newUser.toJSON();
      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`Ya existe un usuario con este DPI: ${createUserDto.dpi}`);
      }
      throw new InternalServerErrorException('Algo salió mal al intentar registrar el usuario', error);
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
      throw new Error('No se pudo actualizar la imagen');
    }
  }

  //Metodo para eliminar
  async deleteUser(userId: string): Promise<void> {
    await this.ticketModel.deleteMany({ userId }).exec();
    const result = await this.userModel.findByIdAndDelete(userId).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
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
    if (!(user.photo instanceof Buffer)) {
      return Buffer.from(user.photo);
    }
    return user.photo
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
      await user.save();

    } catch (error) {
      throw error;
    }
  }

  // Método para actualizar el estado de un usuario
  async updateUserStatus(userId: string, status: boolean): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    );
    if (!updatedUser) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return updatedUser;
  }



  // Método para recuperar la contraseña
  async recoverPassword(email: string, dpi: string): Promise<string> {
    try {
      const user = await this.userModel.findOne({ email, dpi });
      if (!user) {
        throw new BadRequestException('No se encontró un usuario con ese correo y DPI.');
      }
      const newPassword = this.generateRandomPassword();
      const hashedPassword = bcryptjs.hashSync(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'anner123escobar@gmail.com',
          pass: 'wpkb kmbd jwjk xcqq',
        },
      });

      const mailOptions = {
        from: 'anner123escobar@gmail.com',
        to: email,
        subject: 'Recuperación de contraseña',
        text: `Su nueva contraseña es: ${newPassword}`,
      };

      await transporter.sendMail(mailOptions);
      return 'Correo enviado con éxito';
    } catch (error) {
      throw new InternalServerErrorException('Algo salió mal al intentar recuperar la contraseña.', error);
    }
  }

  // Función para generar una nueva contraseña aleatoria
  generateRandomPassword(length = 10): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
}