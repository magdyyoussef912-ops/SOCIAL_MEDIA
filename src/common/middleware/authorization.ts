import { Response,NextFunction } from "express"
import { AuthRequest } from "./authentication.js"
import { AppError } from "../utils/global-error-handler.js"




export const authorization = (roles:string[])=>{
    return (req:AuthRequest,res:Response,next:NextFunction)=>{
        if (!roles.includes(req.user.role)) {
            throw new AppError("unAuthorized")
        }
        next()
    }
}