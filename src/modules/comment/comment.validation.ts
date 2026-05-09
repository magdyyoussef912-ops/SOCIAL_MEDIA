import  * as z from "zod"
import { generalRoles } from "../../common/utils/generalRoles.js"



export const createCommentSchema = {
    body:z.object({
       content:z.string()
    }),
    params:z.object({
        postId:generalRoles.id
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
