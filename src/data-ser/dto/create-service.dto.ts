import { IsString } from 'class-validator';

export class createServiceDto{

@IsString()
_Id:string;

@IsString()
Address:string;

@IsString()
Colonia:string;

@IsString()
serviceType:string;

}

