import { IsString } from 'class-validator';

export class createServiceDto{

@IsString()
userId:string;

@IsString()
serviceAdress:string;

@IsString()
typeOfStableshment:string;

@IsString()
startDate:Date

}

