import  express  from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit'
import { PORT, WHITE_LIST } from './config/config.service.js';
import { successResponse } from './common/utils/successResponsive.js';
import { AppError, globalErrorHandler } from './common/utils/global-error-handler.js';
import authRouter from './modules/auth/auth.controller.js';
import connectionDB from './DB/connectionDB.js';
import RedisClient  from "./common/service/redis.service.js"
import userRouter from './modules/users/user.controller.js';
import { S3Service } from './common/service/s3.service.js';
import { pipeline } from 'stream/promises'; 
import notificationService from './common/service/notification.service.js';
import postRouter from './modules/post/post.controller.js';
import commentRouter from './modules/comment/comment.controller.js';
import adminRouter from './modules/admin/admin.controller.js';
import mongoSanitize  from 'express-mongo-sanitize';
const app : express.Application = express();
const port :number = +PORT;





const bootstrap =  () => {

    const corsOptions = {
        origin: function(origin:string|undefined, callback:Function) {
            if([...WHITE_LIST, undefined].includes(origin!)) {
                callback(null, true)
            } else {
                callback(new AppError("Not allowed by CORS", 403))
            }
        },
        credentials: true
    }

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
    cors(corsOptions),
    helmet(),
    limiter ,
    express.json(),
    // mongoSanitize()
    )

    connectionDB()
    RedisClient.connect()

    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
    })

    app.get("/",(req: Request, res: Response, next: NextFunction)=>{
        successResponse({res, message: "WELCOME IN SOCIAL MEDIA APP.........🤞😍"})
    })

 
    // app.get("/upload/deleteFiles",async (req: Request, res: Response, next: NextFunction)=>{

    //     const {Keys} = req.body as {Keys :string[]}
        
    //     const result = await new S3Service().deleteFiles(Keys) 
        
    //     successResponse({res,data:result}) 
    // })
    // app.get("/upload/deleteFile",async (req: Request, res: Response, next: NextFunction)=>{

    //     const {Key} = req.query as {Key :string}
        
    //     const result = await new S3Service().deleteFile(Key) 
        
    //     successResponse({res,data:result}) 
    // })

    // app.get("/upload/get-files",async (req: Request, res: Response, next: NextFunction)=>{

    //     const {folderName} = req.query as {folderName :string}
        
    //     const result = await new S3Service().getFiles(folderName) 
        
    //     const resltMapped = result.Contents?.map((file)=>{
    //         return {Key:file.Key}
    //     })

    //     successResponse({res,data:resltMapped}) 
    // })

    // app.get("/upload/get-presigned/*path",async (req: Request, res: Response, next: NextFunction)=>{

    //     const {path} = req.params as {path :string[]}
    //     const {download} = req.query as {download:"true" | undefined}
    //     const Key = path.join("/")
    //     console.log({download});
        
    //     const result = await new S3Service().getPreSignedUrl({Key,download}) 

    //     successResponse({res,data:result})
    // })

    // app.get("/upload/*path",async (req: Request, res: Response, next: NextFunction)=>{

    //     const {path} = req.params as {path :string[]}
    //     const {download} = req.query 
        
    //     const Key = path.join("/")
    //     const result = await new S3Service().getFile( 
    //         Key
    //     )
    //     const stream = result.Body as NodeJS.ReadableStream
    //     res.setHeader("Content-type",result.ContentType!)
    //     res.set("Cross-Origin-Resource-Policy", "cross-origin");
    //     if (download && download === "true") { 
    //         res.setHeader("Content-Disposition", `attachment; filename="${path.pop()}"`); 
    //     }
    //     await pipeline(stream,res)
    // })

    app.use("/auth",authRouter)
    app.use("/user",userRouter)
    app.use("/posts",postRouter)
    app.use("/admin",adminRouter)

    app.use("{demo}",(req: Request, res: Response, next: NextFunction)=>{
        throw new AppError(`404  ${req.originalUrl}  with method ${req.method} is not found`, 404) 
    })


    app.use(globalErrorHandler)
}


export default bootstrap;