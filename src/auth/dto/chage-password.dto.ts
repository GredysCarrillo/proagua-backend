import { IsNotEmpty, IsString, MinLength, ValidateIf } from "class-validator";

//Esquema para actualizaar password
export class ChangePasswordDto {

  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres.' })
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
  }