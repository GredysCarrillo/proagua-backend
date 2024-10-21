import { Controller, Get, Post, Body, Param, UseGuards, Request, Put, UseInterceptors, UploadedFile, Res, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { loginDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { loginResponse } from './interfaces/login.response';
import { User } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ChangePasswordDto } from './dto/chage-password.dto';

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


  //metodo para cargar una imagen

  @Put('/uploadPhoto/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(@Param('id') userId: string, @UploadedFile() file: Express.Multer.File,) {
    console.log(userId, file)
    return this.authService.updateUserPhoto(userId, file);
  }
   // Ruta para obtener la foto del usuario por ID
   @Get('/photo/:userId')
   async getUserPhoto(@Param('userId') userId: string, @Res() res: Response) {
     const photoBuffer = await this.authService.getFotoByUserId(userId);
 
     // Establecer el tipo de contenido como imagen (asumimos JPEG, ajusta si es PNG u otro formato)
     res.setHeader('Content-Type', 'image/jpeg'); 
 
     // Enviar la imagen como respuesta binaria
     return res.send(photoBuffer);
   }

   @Patch('change-password/:id')
    async changePassword(@Param('id') userId: string, @Body() changePasswordDto: ChangePasswordDto): Promise<void> {
      console.log(userId, changePasswordDto.newPassword, changePasswordDto.confirmPassword, changePasswordDto.currentPassword);
        return this.authService.changePassword(userId, changePasswordDto);
    }



}
