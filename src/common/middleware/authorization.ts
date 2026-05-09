import { Response,NextFunction,Request } from "express"
import { AppError } from "../utils/global-error-handler.js"




export const authorization = (roles:string[])=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        if (!roles.includes(req.user.role)) {
            throw new AppError("unAuthorized")
        }
        next()
    }
}