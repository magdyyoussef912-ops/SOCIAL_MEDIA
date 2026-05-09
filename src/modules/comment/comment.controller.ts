import { Router } from "express";
import { Authentication } from "../../common/middleware/authentication.js";
import * as CV from "./comment.validation.js";
import { Validation } from "../../common/middleware/validation.js";
import commentRoutes from "./comment.service.js";
const commentRouter = Router()

commentRouter.post("/create-comment/:postId",Authentication,Validation(CV.createCommentSchema),commentRoutes.createComment)
commentRouter.get("/getAllComments/:postId",Authentication,Validation(CV.getAllCommentsSchema),commentRoutes.getAllComments)
commentRouter.delete("/delete-comment/:commentId",Authentication,Validation(CV.deleteCommentSchema),commentRoutes.deleteComment)
commentRouter.patch("/update-comment/:commentId",Authentication,Validation(CV.updateCommentSchema), commentRoutes.updateComment)
export default commentRouter