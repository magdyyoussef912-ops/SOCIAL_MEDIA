import { Router } from "express";
import { Authentication } from "../../common/middleware/authentication.js";
import multerCloud from "../../common/middleware/multer.cloud.js";
import { multer_enum, MulterStorageType } from "../../common/enum/multer.enum.js";
import postRoutes from "./post.service.js";
import * as PV from "./post.validation.js"
import { Validation } from "../../common/middleware/validation.js";
import commentRouter from "../comment/comment.controller.js";

const postRouter = Router() 

postRouter.use("/:postId/comments{/:commentId/replies}",commentRouter)

postRouter.post("/createPost",
  Authentication, 
  multerCloud({costume_types: multer_enum.image}).array("attachments"),
  Validation(PV.createPostSchema),
  postRoutes.createPost
)
 
postRouter.get("/getAllPosts",Authentication,postRoutes.getAllPosts)
postRouter.get("/get/:postId",Authentication,postRoutes.getPost)
 
postRouter.patch("/likeOrDislikePost/:postId",Authentication,Validation(PV.likePostSchema),postRoutes.likePost)
postRouter.patch("/updateContentAndSettings/:postId",Authentication,Validation(PV.updatePostSchema),postRoutes.updatePostContentAndSettings)
postRouter.patch("/updateAttachments/:postId",Authentication,multerCloud({costume_types: multer_enum.image}).array("attachments"),postRoutes.updatePostAttachments)
postRouter.delete("/delete/:postId",Authentication,Validation(PV.deletePostSchema),postRoutes.deletePost)




export default postRouter