import { Router } from "express";
import { Authentication } from "../../common/middleware/authentication.js";
import userRoutes from "./user.service.js";
const userRouter = Router();
userRouter.get("/profile", Authentication, userRoutes.getUser);
export default userRouter;
