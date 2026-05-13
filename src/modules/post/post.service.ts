import { NextFunction, Request, Response } from "express";
import userRepository from "../../DB/repositories/user.repository.js";
import { successResponse } from "../../common/utils/successResponsive.js";
import { S3Service } from "../../common/service/s3.service.js";
import postRepository from "../../DB/repositories/post.repository.js";
import { IcreatePostType, IupdatePostType } from "./post.dto.js";
import { AppError } from "../../common/utils/global-error-handler.js";
import { Types } from "mongoose";

import RedisClient from "../../common/service/redis.service.js"; 
import { randomUUID } from "node:crypto";
import { MulterStorageType } from "../../common/enum/multer.enum.js";
import notificationService from "../../common/service/notification.service.js";
import { AvailabiltyEnum, likesPostEnum } from "../../common/enum/post.enum.js";
import { AvailabiltyPost } from "../../common/utils/post.utils.js";
import { populate } from "dotenv";

class postRoutes {
    private readonly _userModel = new userRepository() 
    private readonly _postModel = new postRepository() 
    private readonly _S3Bucket = new S3Service() 
    private readonly _redisClient = RedisClient 
    private readonly _notificationClient = notificationService 
    constructor(){} 

    createPost = async (req:Request,res:Response,next:NextFunction)=>{ 
        const {allowComents,availabilty,content,tags} :IcreatePostType = req.body
            
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
            path:`users/${req?.user?._id}/posts/${folderId}`,
            storage_type:MulterStorageType.MEMORY
         }) as unknown as string[]    
        }

        const post = await this._postModel.create({
            content:content!,
            tags:mentions,
            folderId,
            attachments:urls,
            allowComents,
            availabilty,
            createdBy:req?.user?._id
        })

        if (!post) {
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

        successResponse({res,message:"Post created successfully",data:post})
    }

    updatePostContentAndSettings = async (req:Request,res:Response,next:NextFunction)=>{
        const {postId} = req.params
        const {content,tags,allowComents,availabilty}:IupdatePostType  = req.body
        const _id = new Types.ObjectId(postId as string)

        const post = await this._postModel.findOne({
            filter:{ _id,createdBy:req?.user?._id }
        })
          
        if (!post) {
            throw new AppError("Post not found")
        } 

        if (content) {
            post.content = content 
        }


        if (allowComents) {
            post.allowComents = allowComents
        }

        if (availabilty) {
            post.availabilty = availabilty
        }


        if (tags?.length) {
            let mentions : Types.ObjectId[] = []
            let FCMTokens : string[] = []

            const mentionsTags = await this._userModel.find({
                filter:{_id:{ $in: tags }}
            })
            if (mentionsTags.length !== tags.length) {
                throw new AppError("Invalid tags")
            }
            for (const tag of mentionsTags) {
                if (tag._id.toString() === req.user?._id.toString()) {
                    throw new AppError("you can't mention your self")
                } 
                mentions.push(tag?._id);
                (await this._redisClient.getFCMs({userId:tag?._id})).map((token:string)=>{
                    FCMTokens.push(token) 
                })  
            }
            post.tags = mentions
        }

        await post.save()
        
        successResponse({res,message:"Post updated successfully",data:post}) 

    }

    updatePostAttachments = async (req:Request,res:Response,next:NextFunction)=>{ 
        const {postId} = req.params
        const _id = new Types.ObjectId(postId as string)
        
        const post = await this._postModel.findOne({
            filter:{ _id,createdBy:req?.user?._id }
        })  

        if (!post) {
            throw new AppError("Post not found")
        }
        if (req?.files) {
            await this._S3Bucket.deleteFiles(post?.attachments as string[])
            let urls :string[]=[]
            let folderId = randomUUID() 
            urls = await this._S3Bucket.uploadFiles({
                files:req.files as Express.Multer.File[],
                path:`users/${req?.user?._id}/posts/${folderId}`,
                storage_type:MulterStorageType.MEMORY
            }) as unknown as string[] 
            post.attachments = urls 
            post.folderId = folderId
            await post.save()
        } 
        successResponse({res,message:"Post updated successfully",data:post}) 
    }

    getAllPosts = async (req:Request,res:Response,next:NextFunction)=>{
        
        
      const posts = await this._postModel.pagenate({
            page: + req?.query?.page! ,
            limit: + req?.query?.limit!,
            search:{
                $or:[...AvailabiltyPost(req)],
                ...(req.query?.search ? {
                    $or:[
                        { content : { $regex : req.query?.search , $options : "i" } }
                    ]
                } :{})
            },
            populate:[
                {
                    path:"comments",
                    match:{
                        commentID:{$exists:false}
                    },
                    populate:[
                        {
                            path:"replies"
                        }
                    ]
                }
            ]
        })

      if (posts?.Meta.totalDoc === 0) {
        throw new AppError("No posts found")
      }
      
      successResponse({res,message:"Posts fetched successfully",data:posts}) 
    }
    
    getPost = async (req:Request,res:Response,next:NextFunction)=>{
      const {postId}  = req.params
      const _id = new Types.ObjectId(postId as string) 
      
      const post = await this._postModel.findOne({
        filter:{ _id} 
      }) 
      if (!post) {
        throw new AppError("Post not found")
      }
      
      successResponse({res,message:"Post fetched successfully",data:post}) 
    }

    likePost = async (req:Request,res:Response,next:NextFunction)=>{
      const {postId}  = req.params
      const _id = new Types.ObjectId(postId as string) 
      const {flag} = req.query


      let updateQuery : any = {
            $addToSet:{likes:req.user?._id}
        }

        if (flag == likesPostEnum.Dislike) {
            updateQuery = {
                $pull:{likes:req.user?._id}
            }
        }
      
      const post = await this._postModel.findOneAndUpdate({
          filter:{
             $or: [...AvailabiltyPost(req)] ,
              _id 
            } ,
        update: updateQuery
      }) 

      if (!post) {
        throw new AppError("Post not found or not authorized")
      }
      
      successResponse({res,message:"Post fetched successfully",data:post}) 
    }
    
    deletePost = async (req:Request,res:Response,next:NextFunction)=>{
      const {postId}  = req.params
        
      const _id = new Types.ObjectId(postId as string)
      
      const post = await this._postModel.findOneAndDelete({
            filter:{ _id , createdBy:req.user?._id } 
      })
      if (!post) {
        throw new AppError("Post not found")
      }  
      if (post?.attachments?.length) {
        await this._S3Bucket.deleteFiles(post?.attachments)
      }
      successResponse({res,message:"Post deleted successfully"})
    }

}
export default new postRoutes()