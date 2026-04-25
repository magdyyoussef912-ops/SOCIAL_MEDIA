import * as z from "zod"
import { confirmEmailSchema, forgetPasswordSchema, resendOtpSchema, resetPasswordSchema, signInSchema, signUPSchema, updatePasswordSchema } from "./user.validation.js"


export type ISignUpType = z.infer<typeof signUPSchema.body>
export type ISignInType = z.infer<typeof signInSchema.body>
export type IconfirmEmailType = z.infer<typeof confirmEmailSchema.body>
export type IresendOtpType = z.infer<typeof resendOtpSchema.body>
export type IforgetPasswordType = z.infer<typeof forgetPasswordSchema.body>
export type IresetPasswordType = z.infer<typeof resetPasswordSchema.body>
export type IupdatePasswordType = z.infer<typeof updatePasswordSchema.body>
