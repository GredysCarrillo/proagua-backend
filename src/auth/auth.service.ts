import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';


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

  async createService(){
    
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