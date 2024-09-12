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


@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtServive: JwtService,
  ) { }


//metodo para crear un usuario
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {

      const { password, ...rest } = createUserDto;
      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 10),
        ...rest
      })

      await newUser.save();
      const { password: _, ...user } = newUser.toJSON();
      return user;

    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`Ya existe un usuario con este DPI ${createUserDto.dpi}`);
      }
      throw new InternalServerErrorException('Algo salio mal al intentar registrar el usuario');
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
  
      const { password:_, ...rest } = user.toJSON();
  
      return {
        user: rest,
        token: this.getJwtToken({ id: user.id }),
      }
    }

    getJwtToken(payload: jwtPayload) {
      const token = this.jwtServive.sign (payload);
      return token;
    }

    async findUserById(id: string){
      const user = await this.userModel.findById(id);
      const {password, ...rest} = user.toJSON();
      return rest;
    }
    

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }


}