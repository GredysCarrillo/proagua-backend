import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
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
    const firstFourDigitsOfDpi = dpi.slice(0, 5);
    const firstFourLettersOfName = name.slice(0, 5).toLowerCase(); 
    return `${firstFourDigitsOfDpi}${firstFourLettersOfName}`;
  }

  //Metodo para buscar por Id
  async findUserById(id: string) {
    const user = await this.userModel.findById(id);
    const { password, ...rest } = user.toJSON();
    return rest;
  }

 async findAll():Promise<User[]> {
    return this.userModel.find().exec();
  }

  //Metodo para actualizar
  update(id: number, updateAuthDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  //Metodo para eliminar
  remove(id: number) {
    return `This action removes a #${id} auth`;
  }


}