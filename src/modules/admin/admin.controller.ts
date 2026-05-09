import { Router } from "express";
import adminRoutes from "./admin.service.js";
import { authorization } from "../../common/middleware/authorization.js";
import { RoleEnum } from "../../common/enum/user.enum.js";
import { Authentication } from "../../common/middleware/authentication.js";
const adminRouter = Router()

adminRouter.get("/Dashboard",Authentication,authorization([RoleEnum.ADMIN]),adminRoutes.Dashboard) 

export default adminRouter