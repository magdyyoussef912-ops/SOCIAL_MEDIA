import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../DB/model/user.model.ts";
import { HydratedDocument } from "mongoose";


// export interface IJwtPayload extends JwtPayload{
//     id?:string
// }


declare global{
    namespace Express {
        interface Request{
            user:HydratedDocument<IUser>
            decoded:IJwtPayload
        }
    }
}
