import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Req, Put, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { loginDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { loginResponse } from './interfaces/login.response';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post('/createUser')
  createUser(@Body() createAuthDto: CreateUserDto) {
    return this.authService.createUser(createAuthDto);
  }


  @Post('/login')
  login(@Body() loginDto: loginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard)
  @Get('/check-token')
  checkToken(@Request() req: Request): loginResponse {
    const user = req['user'] as User;
    return {
      user,
      token: this.authService.getJwtToken({ id: user._id })
    }
  }

  @Get('/users')
  findAll(): Promise<User[]> {
    return this.authService.findAll();
  }

  @Get(':id')
  finByUserById(@Param('id') id: string) {
    return this.authService.findUserById(id);
  }

  // Método para obtener el usuario logueado
  @Get('/me/:id')
  async getCurrentUser(@Param('id') id: string) {
    return this.authService.findUserById(id);
  }


  //not implemented methods



}
