import  * as z from "zod"
import { generalRoles } from "../../common/utils/generalRoles.js"
import { onModelEnum } from "../../common/enum/post.enum.js"



export const createCommentSchema = {
    body:z.strictObject({
            content:z.string().optional(),
            attachments:z.array(generalRoles.file).optional(),
            tags:z.array(generalRoles.id).optional(),
            onModel : z.enum(onModelEnum)
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
        }),

        params:z.strictObject({
            postId:generalRoles.id,
            commentId:generalRoles.id.optional()
        })
}

export const getAllCommentsSchema = {
    params:z.object({
        postId:generalRoles.id
    }),
    query:z.object({
        page:z.string().optional(),
        limit:z.string().optional()
    })
} 

export const deleteCommentSchema = {
    params:z.object({
        commentId:generalRoles.id
    })
} 

export const updateCommentSchema = {
    params:z.object({
        commentId:generalRoles.id
    }),
    body:z.object({
        content:z.string()
    })
} 
