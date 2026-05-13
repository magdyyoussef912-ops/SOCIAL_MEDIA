import { NextFunction, Request, Response } from "express";
import userRepository from "../../DB/repositories/user.repository.js";
import { decrypt, encrypt } from "../../common/utils/security/dcrypt.security.js";
import { successResponse } from "../../common/utils/successResponsive.js";
import { S3Service } from "../../common/service/s3.service.js";
import { Compare, Hash } from "../../common/utils/security/Hash.security.js";
import { AppError } from "../../common/utils/global-error-handler.js";
import { IupdatePasswordType, IupdateUserType } from "./user.dto.js";
import { Types } from "mongoose";
import postRepository from "../../DB/repositories/post.repository.js";
import commentRepository from "../../DB/repositories/comment.repository.js";
import { AvailabiltyEnum } from "../../common/enum/post.enum.js";




class userRoutes {
    private readonly _userModel = new userRepository() 
    private readonly _postModel = new postRepository() 
    private readonly _commentModel = new commentRepository() 
    private readonly _S3Bucket = new S3Service() 
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

    updateUser = async (req:Request,res:Response,next:NextFunction)=>{
        const {address,age,gender,phone,firstName,lastName} :IupdateUserType = req.body

        const updateData:IupdateUserType = {}

        if(firstName){
            updateData.firstName = firstName
        }
        if(lastName){
            updateData.lastName = lastName
        }
        if(address){
            updateData.address = address
        }
        if(age){
            updateData.age = age
        }
        if(gender){
            updateData.gender = gender
        }
        if(phone){
            updateData.phone = encrypt(phone)
        }
        if (Object.keys(updateData).length=== 0) {
            throw new AppError("No data to update")
        }
        await this._userModel.findOneAndUpdate({
            filter:{_id:req.user._id},
            update:updateData
        })
        
        

        
        successResponse({res,message:"done"})
    }

    updatePassword = async (req:Request,res:Response,next:NextFunction)=>{
        const {oldPassword,newPassword,confirmPassword} :IupdatePasswordType = req.body
        
        const user = await this._userModel.findOne({
            filter:{_id:req.user._id},
            projection:{password:1}
        })
          
        if(!user){
            return next(new Error("User not found"))
        }

        if (!await Compare({plainText:oldPassword,cipherText:user?.password})) {
            throw new AppError("Incorrect password",401)
        } 
        if (newPassword !== confirmPassword) {
            throw new AppError("Passwords do not match",401)
        }

        const hashPassword = await Hash({plainText:newPassword})

        await this._userModel.findOneAndUpdate({
            filter:{_id:req.user._id},
            update:{password:hashPassword}
        })

        successResponse({res,message:"Password changed successfully"})
    }


    deleteAccount = async (req:Request,res:Response,next:NextFunction)=>{
       
       await this._userModel.deleteOne({
        filter:{_id:req.user._id},
       }) 
        successResponse({res,message:"Account deleted successfully"})
    }

    getUserProfile = async (req:Request,res:Response,next:NextFunction)=>{
       const {userId} = req.params
       const _id = new Types.ObjectId(userId as string)


       const [user,posts,comments] = await Promise.all([
         this._userModel.findOne({
            filter:{_id},
            projection:{password:0}}),
         this._postModel.find({filter:{createdBy:_id,availability: AvailabiltyEnum.Public}}),
         this._commentModel.find({filter:{createdBy:_id}})
       ])


       successResponse({res,message:"done",data:{user,posts,comments}})
    }

    
}
export default new userRoutes()