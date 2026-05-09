import * as z from "zod"
import { createPostSchema,updatePostSchema  } from "./post.validation.js"



export type IcreatePostType = z.infer<typeof createPostSchema.body>
export type IupdatePostType = z.infer<typeof updatePostSchema.body>
