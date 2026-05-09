import { Router } from "express";
import { Authentication } from "../../common/middleware/authentication.js";
import userRoutes from "./user.service.js"
import * as UV from "./user.validation.js";
import { Validation } from "../../common/middleware/validation.js";

const userRouter = Router()

userRouter.get("/profile",Authentication,userRoutes.getUser)
userRouter.patch("/update",Authentication,Validation(UV.updateUserSchema),userRoutes.updateUser)
userRouter.patch("/update-password",Authentication,Validation(UV.updatePasswordSchema),userRoutes.updatePassword)
userRouter.delete("/delete",Authentication,userRoutes.deleteAccount)
userRouter.get("/:userId/profile",Authentication,userRoutes.getUserProfile)

export default userRouter 