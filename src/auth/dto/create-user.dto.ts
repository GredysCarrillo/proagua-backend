import { IsEmail, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @IsString()
    name: string;

    @IsString()
    dpi: string;

    @IsEmail()
    email: string;

    @IsString()
    phoneNumber: string;

    @MinLength(8)
    password: string;

}
