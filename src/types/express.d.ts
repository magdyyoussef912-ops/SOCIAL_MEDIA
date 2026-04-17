import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../DB/model/user.model.ts";


export interface IJwtPayload extends JwtPayload{
    id?:string
}


declare global{
    namespace Express {
        interface Request{
            user:IUser
            decoded:IJwtPayload
        }
    }
}
