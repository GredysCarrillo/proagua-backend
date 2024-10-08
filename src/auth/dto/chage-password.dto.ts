import { IsNotEmpty, IsString, MinLength, ValidateIf } from "class-validator";

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres.' })
  newPassword: string;

 /*  @ValidateIf((o) => o.newPassword) */
  @IsNotEmpty()
  @IsString()
  confirmPassword: string; // Asegúrate de que esta línea esté presente
  }