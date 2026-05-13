import { NextFunction, Request, Response } from "express";
import userRepository from "../../DB/repositories/user.repository.js";
import { decrypt, encrypt } from "../../common/utils/security/dcrypt.security.js";
import { successResponse } from "../../common/utils/successResponsive.js";
import { S3Service } from "../../common/service/s3.service.js";
import { Compare, Hash } from "../../common/utils/security/Hash.security.js";
import { AppError } from "../../common/utils/global-error-handler.js";
import { HydratedDocument, Types } from "mongoose";
import postRepository from "../../DB/repositories/post.repository.js";
import commentRepository from "../../DB/repositories/comment.repository.js";
import { IcreateCommentType } from "./comment.dto.js";
import { AvailabiltyPost } from "../../common/utils/post.utils.js";
import { AllowCommentEnum, onModelEnum } from "../../common/enum/post.enum.js";
import redisClient from "../../common/service/redis.service.js";
import  notificationService  from "../../common/service/notification.service.js";
import { randomUUID } from "node:crypto";
import { MulterStorageType } from "../../common/enum/multer.enum.js";
import { IPost } from "../../DB/model/post.model.js";
import { IComment } from "../../DB/model/comment.model.js";



class commentRoutes {
    private readonly _userModel = new userRepository() 
    private readonly _postModel = new postRepository()  
    private readonly _commentModel = new commentRepository()  
    private readonly _S3Bucket = new S3Service() 
    private readonly _redisClient =  redisClient
    private readonly _notificationClient =  notificationService
    constructor(){}


    createComment = async (req:Request,res:Response,next:NextFunction)=>{
        const {postId,commentId}  = req.params
        const {content,tags,onModel} :IcreateCommentType = req.body
        
        let doc :HydratedDocument<IPost|IComment>  | null = null  
        if (onModel === onModelEnum.post && !commentId) {
            doc = await this._postModel.findOne({
                filter:{
                    _id:postId,
                    $or:[
                        ...AvailabiltyPost(req)
                    ],
                    allowComents:AllowCommentEnum.Allow
                }
            })
            if (!doc) {
                throw new AppError("Post not found or you can't comment on this post")
            }
        }else if (onModel === onModelEnum.comment && commentId){
            const comment = await this._commentModel.findOne({
                filter:{
                    _id:commentId,
                    refId:postId!
                },
                options:{
                    populate:[
                            {
                                path:"refId",
                                match:{
                                    $or:[
                                        ...AvailabiltyPost(req)
                                    ],
                                    allowComents:AllowCommentEnum.Allow
                                }
                            }
                        ]
                    }
                    
                })

                if (!comment?.refId) {
                    throw new AppError("Post not found or you can't comment on this post")
                }
                doc = comment
        }


         let mentions : Types.ObjectId[] = []
                let FCMTokens : string[] = []
                if (tags?.length) {
                    const mentionsTags = await this._userModel.find({
                        filter:{_id:{ $in: tags }}
                    })
                    if (mentionsTags.length !== tags.length) {
                        throw new AppError("Invalid tags",)
                    }
                    for (const tag of mentionsTags) { 
                        if (tag._id.toString() === req?.user._id.toString()) {
                            throw new AppError("you can't mention your self")
                        }
                        mentions.push(tag?._id) ;
                        (await this._redisClient.getFCMs({userId:tag?._id})).map((token:string)=>{
                            FCMTokens.push(token) 
                        }) 
                    }
                }
        
                let urls :string[]=[]
                let folderId = randomUUID()
                if (req?.files) {
                 urls = await this._S3Bucket.uploadFiles({ 
                    files:req.files as Express.Multer.File[],
                    path:`users/${req?.user?._id}/posts/${doc?.folderId}/comments/${folderId}`,
                    storage_type:MulterStorageType.MEMORY
                 }) as unknown as string[]    
                } 
        
                const comment = await this._commentModel.create({
                    content:content!,
                    tags:mentions,
                    folderId,
                    attachments:urls,
                    createdBy:req?.user?._id,
                    refId:doc?._id!,
                    onModel:onModel!,
                })
        
                if (!comment) {
                    await this._S3Bucket.deleteFiles(urls)
                    throw new AppError("Failed to create post")
                } 
        
                if (FCMTokens?.length) {
                    await this._notificationClient.sendNotifications({
                        tokens:FCMTokens,
                        data:{
                            title:"you mention on new post",
                            body:content || ""
                        }
                    })
                }

        successResponse({res,message:"Comment created successfully",data:comment})
       
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