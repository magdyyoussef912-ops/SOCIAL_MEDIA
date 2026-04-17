import  express  from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit'
import { PORT } from './config/config.service.js';
import { successResponse } from './common/utils/successResponsive.js';
import { AppError, globalErrorHandler } from './common/utils/global-error-handler.js';
import authRouter from './modules/auth/user.controller.js';
import connectionDB from './DB/connectionDB.js';
import { checkRedisConnection } from './DB/redis/connectionRedis.js';
const app : express.Application = express();
const port :number = +PORT;






const bootstrap =  () => {

    const limiter  = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers,
        message: "Too many requests from this IP, please try again after 15 minutes",
        handler:(req: Request, res: Response, next: NextFunction)=>{
            throw new AppError("Too many requests from this IP, please try again after 15 minutes", 429)
        }
    })

    app.use(
    cors(),
    helmet(),
    limiter ,
    express.json()
    )

    connectionDB()
    checkRedisConnection()

    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
    })

    app.get("/",(req: Request, res: Response, next: NextFunction)=>{
        successResponse({res, message: "WELCOME IN SOCIAL MEDIA APP.........🤞😍"})
    })

    app.use("/auth",authRouter)

    app.use("{demo}",(req: Request, res: Response, next: NextFunction)=>{
        throw new AppError(`404  ${req.originalUrl}  with method ${req.method} is not found`, 404) 
    })


    app.use(globalErrorHandler)
}


export default bootstrap;