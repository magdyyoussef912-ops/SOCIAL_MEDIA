import { NextFunction, Request, Response } from "express";
import userRepository from "../../DB/repositories/user.repository.js";
import { decrypt } from "../../common/utils/security/dcrypt.security.js";
import { successResponse } from "../../common/utils/successResponsive.js";




class userRoutes {
    private readonly _userModel = new userRepository() 
    constructor(){}

    getUser = async (req:Request,res:Response,next:NextFunction)=>{
        const userName = req.user.userName
        const age = req.user.age
        const address = req.user.address
        const gender = req.user.gender
        const phone = decrypt(req.user.phone!)
        const email = req.user.email
        successResponse({res,message:"done",data:{user:{userName,age,address,gender,phone,email}}})
        // const user = res.locals.user
        // successResponse({res,message:"done",data:{user}})
    }
}

export default new userRoutes()