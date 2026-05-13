import * as z from "zod";
import { createCommentSchema, updateCommentSchema } from "./comment.validation.js";


export type IcreateCommentType = z.infer<typeof createCommentSchema.body>
export type IupdateCommentType = z.infer<typeof updateCommentSchema.body>
