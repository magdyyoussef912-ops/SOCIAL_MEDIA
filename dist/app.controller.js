import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { PORT } from './config/config.service.js';
import { successResponse } from './common/utils/successResponsive.js';
import { AppError, globalErrorHandler } from './common/utils/global-error-handler.js';
import authRouter from './modules/auth/user.controller.js';
import connectionDB from './DB/connectionDB.js';
import RedisClient from "./common/service/redis.service.js";
import userRouter from './modules/users/user.controller.js';
const app = express();
const port = +PORT;
const bootstrap = () => {
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
        message: "Too many requests from this IP, please try again after 15 minutes",
        handler: (req, res, next) => {
            throw new AppError("Too many requests from this IP, please try again after 15 minutes", 429);
        }
    });
    app.use(cors(), helmet(), limiter, express.json());
    connectionDB();
    RedisClient.connect();
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
    app.get("/", (req, res, next) => {
        successResponse({ res, message: "WELCOME IN SOCIAL MEDIA APP.........🤞😍" });
    });
    app.use("/auth", authRouter);
    app.use("/user", userRouter);
    app.use("{demo}", (req, res, next) => {
        throw new AppError(`404  ${req.originalUrl}  with method ${req.method} is not found`, 404);
    });
    app.use(globalErrorHandler);
};
export default bootstrap;
