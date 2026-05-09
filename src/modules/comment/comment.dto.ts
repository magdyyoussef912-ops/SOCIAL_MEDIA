import * as z from "zod";
import { createCommentSchema } from "./comment.validation.js";


export type IcreateCommentType = z.infer<typeof createCommentSchema.body>

// export type IupdatePasswordType = z.infer<typeof updatePasswordSchema.body>