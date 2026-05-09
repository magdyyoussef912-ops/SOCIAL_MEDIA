import * as z from "zod"
import { AllowCommentEnum, AvailabiltyEnum } from "../../common/enum/post.enum.js"
import { Types } from "mongoose"
import { generalRoles } from "../../common/utils/generalRoles.js"




export const createPostSchema = {
    body:z.object({
        content:z.string().optional(),
        attachments:z.array(generalRoles.file).optional(),
        tags:z.array(generalRoles.id).optional(),
        allowComents:z.enum(AllowCommentEnum).default(AllowCommentEnum.Allow),
        availabilty:z.enum(AvailabiltyEnum).default(AvailabiltyEnum.Public)
    }).superRefine((args,ctx)=>{

        if (!args.content && !args.attachments?.length) {
            ctx.addIssue({
                code:"custom",
                message:"Post must have content or attachments",
                path:["content"]
            })
        }

        if (args?.tags) {
            const uniqueTags = new Set(args?.tags)
            if (args?.tags.length !== uniqueTags.size) {
                ctx.addIssue({
                    code:"custom",
                    message:"Tags must be unique",
                    path:["tags"]
                })
            }
        }
    })
} 


export const    deletePostSchema = {
    params:z.object({
        postId:generalRoles.id
    })
} 

export const    likePostSchema = {
    params:z.object({
        postId:generalRoles.id
    })
} 




export const updatePostSchema = {
    params:z.object({
        postId:generalRoles.id
    }),
    body:z.object({
        content:z.string().optional(),
        tags:z.array(generalRoles.id).optional(),
        allowComents:z.enum(AllowCommentEnum).optional(),
        availabilty:z.enum(AvailabiltyEnum).optional()
    }).superRefine((args,ctx)=>{
        if (!args.content && !args.tags?.length && !args.allowComents && !args.availabilty) {
            ctx.addIssue({
                code:"custom",
                message:"Post must have content or tags or allowComents or availabilty",
                path:["content"]
            })
        }
    })
}