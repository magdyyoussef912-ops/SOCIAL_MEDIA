import { NextFunction, Request, Response } from "express";
import userRepository from "../../DB/repositories/user.repository.js";
import { successResponse } from "../../common/utils/successResponsive.js";
import { S3Service } from "../../common/service/s3.service.js";
import postRepository from "../../DB/repositories/post.repository.js";
import { AppError } from "../../common/utils/global-error-handler.js";
import { Types } from "mongoose";

import RedisClient from "../../common/service/redis.service.js"; 
import { randomUUID } from "node:crypto";
import { MulterStorageType } from "../../common/enum/multer.enum.js";
import notificationService from "../../common/service/notification.service.js";
import { AvailabiltyEnum } from "../../common/enum/post.enum.js";
import commentRepository from "../../DB/repositories/comment.repository.js";


class adminRoutes {
    private readonly _userModel = new userRepository() 
    private readonly _postModel = new postRepository() 
    private readonly _commentModel = new  commentRepository() 
    private readonly _S3Bucket = new S3Service() 
    private readonly _redisClient = RedisClient 
    private readonly _notificationClient = notificationService 
    constructor(){} 

    Dashboard = async(req:Request, res:Response, next:NextFunction) => {
        const [users, posts, comments] = await Promise.all([
            this._userModel.find({ filter: {} }),
            this._postModel.find({ filter: {} }),
            this._commentModel.find({ filter: {} }), 
        ]) 

        successResponse({res,
            message: "Your Dashboard",
            data: {
                totalUsers: users.length,
                totalPosts: posts.length,
                totalComments: comments.length,
            }
        })
    }

}
export default new adminRoutes()