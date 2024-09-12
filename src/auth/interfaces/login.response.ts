import { User } from "../entities/user.entity";

export interface loginResponse{

    user: User;
    token:string;
}