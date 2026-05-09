import { NextFunction, Request, Response } from "express";
import userRepository from "../../DB/repositories/user.repository.js";
import { decrypt, encrypt } from "../../common/utils/security/dcrypt.security.js";
import { successResponse } from "../../common/utils/successResponsive.js";
import { S3Service } from "../../common/service/s3.service.js";
import { Compare, Hash } from "../../common/utils/security/Hash.security.js";
import { AppError } from "../../common/utils/global-error-handler.js";
import { Types } from "mongoose";
import postRepository from "../../DB/repositories/post.repository.js";
import commentRepository from "../../DB/repositories/comment.repository.js";
import { IcreateCommentType } from "./comment.dto.js";




class commentRoutes {
    private readonly _userModel = new userRepository() 
    private readonly _postModel = new postRepository()  
    private readonly _commentModel = new commentRepository()  
    private readonly _S3Bucket = new S3Service() 
    constructor(){}


    createComment = async (req:Request,res:Response,next:NextFunction)=>{
        const {postId}  = req.params
        const _id = new Types.ObjectId (postId as string) 
        const {content} :IcreateCommentType = req.body
        
        const post = await this._postModel.findOne({
            filter:{_id}
        })
        if (!post) {
            throw new AppError("Post not found")
        }
        const comment = await this._commentModel.create({
            content,
            createdBy:req?.user?._id,
            postId:post._id
        })

        successResponse({res,message:"Comment created successfully",data:comment})
       
    }

    getAllComments = async (req:Request,res:Response,next:NextFunction)=>{
        const {postId}  = req.params
        const _id = new Types.ObjectId (postId as string) 
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit
        
        const post = await this._postModel.findOne({
            filter:{_id}
        })
        if (!post) {
            throw new AppError("Post not found")
        }


        const comments = await this._commentModel.find({
            filter:{postId:post._id},
            options:{
                limit,
                skip
            }
        })

        successResponse({res,message:"All Comments",data:comments})
       
    }

    updateComment = async (req:Request,res:Response,next:NextFunction)=>{
        const {commentId}  = req.params 
        const _id = new Types.ObjectId (commentId as string) 
        const {content} = req.body
        
        const comment = await this._commentModel.findOneAndUpdate({
            filter:{_id,createdBy:req?.user?._id},
            update:{content}
        })
        if (!comment) {
            throw new AppError("Comment not found")
        }
        successResponse({res,message:"Comment updated successfully",data:comment})
    }
    
    deleteComment = async (req:Request,res:Response,next:NextFunction)=>{
        const {commentId}  = req.params
        const _id = new Types.ObjectId (commentId as string) 

        const comment = await this._commentModel.findOneAndDelete({
            filter:{_id,createdBy:req?.user?._id} 
        })
        if (!comment) {
            throw new AppError("Comment not found")
        }

        successResponse({res,message:"Comment deleted successfully"})
       
    }



 
    }
export default new commentRoutes()