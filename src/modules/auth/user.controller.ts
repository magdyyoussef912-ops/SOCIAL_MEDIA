import * as UV from './user.validation.js';
import { Router } from "express";
import UserService from "./user.service.js";
import { Validation } from "../../common/middleware/validation.js";
import { authorization } from '../../common/middleware/authorization.js';
import { RoleEnum } from '../../common/enum/user.enum.js';
import { Authentication } from '../../common/middleware/authentication.js';
const authRouter = Router()


authRouter.post("/signUp",Validation(UV.signUPSchema),UserService.signUp)


authRouter.post("/signup/gmail",UserService.SignUpWithGmail)



authRouter.post("/signIn",Validation(UV.signInSchema),UserService.signIn)

authRouter.patch("/confirmEmail",Validation(UV.confirmEmailSchema),UserService.confirmEmail)

authRouter.post("/resendOtp",Validation(UV.resendOtpSchema),UserService.resendOtp)

authRouter.post("/forgetPassword",Validation(UV.forgetPasswordSchema),UserService.forgetPassword)

authRouter.patch("/resetPassword",Validation(UV.resetPasswordSchema),UserService.resetPassword)

authRouter.patch("/updatePassword",Authentication,Validation(UV.updatePasswordSchema),authorization([RoleEnum.USER]),UserService.updatePassword)

authRouter.post("/logOut",Authentication,UserService.logout)

export default authRouter;