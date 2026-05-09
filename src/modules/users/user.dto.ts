import * as z from "zod";
import { updatePasswordSchema, updateUserSchema } from "./user.validation.js";



export type IupdateUserType = z.infer<typeof updateUserSchema.body>

export type IupdatePasswordType = z.infer<typeof updatePasswordSchema.body>