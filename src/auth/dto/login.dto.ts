import { IsEmail, IsString, MinLength } from "class-validator";


export class loginDto{

    @IsString()
    dpi:string;

    @MinLength(8)
    password:string;

}