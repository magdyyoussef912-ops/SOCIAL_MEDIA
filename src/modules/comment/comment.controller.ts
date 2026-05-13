import { Router } from "express";
import { Authentication } from "../../common/middleware/authentication.js";
import * as CV from "./comment.validation.js";
import { Validation } from "../../common/middleware/validation.js";
import commentRoutes from "./comment.service.js";
import multerCloud from "../../common/middleware/multer.cloud.js";
import { multer_enum } from "../../common/enum/multer.enum.js";
const commentRouter = Router({mergeParams:true})



commentRouter.post("/",Authentication,
    multerCloud({costume_types:multer_enum.image}).array("attachments"),
    Validation(CV.createCommentSchema),
    commentRoutes.createComment
)

// commentRouter.get("/",Authentication,Validation(CV.getAllCommentsSchema),commentRoutes.getAllComments)
commentRouter.delete("/:commentId",Authentication,Validation(CV.deleteCommentSchema),commentRoutes.deleteComment)
commentRouter.patch("/:commentId",Authentication,Validation(CV.updateCommentSchema), commentRoutes.updateComment)
export default commentRouter