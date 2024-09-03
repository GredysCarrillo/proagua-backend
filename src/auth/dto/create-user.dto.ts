import { IsEmail, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @IsString()
    name: string;

    @IsNumber()
    @MinLength(13)
    @MaxLength(13)
    dpi: number;

    @IsEmail()
    email: string;

    @IsNumber()
    phoneNumber: number;

    @MinLength(8)
    password: string;

    @IsString()
    rol: string[];

}
