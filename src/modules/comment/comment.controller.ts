import { Router } from "express";
import { Authentication } from "../../common/middleware/authentication.js";
import * as CV from "./comment.validation.js";
import { Validation } from "../../common/middleware/validation.js";
import commentRoutes from "./comment.service.js";
import multerCloud from "../../common/middleware/multer.cloud.js";
import { multer_enum } from "../../common/enum/multer.enum.js";
const commentRouter = Router({ mergeParams: true })



commentRouter.post("/", Authentication,
    multerCloud({ costume_types: multer_enum.image }).array("attachments"),
    Validation(CV.createCommentSchema),
    commentRoutes.createComment
)
commentRouter.patch("/updateContentAndSettings/:commentId", Authentication, Validation(CV.updateCommentSchema), commentRoutes.updateContentAndSettings)
commentRouter.patch("/updateAttachments/:commentId", Authentication, multerCloud({ costume_types: multer_enum.image }).array("attachments"), commentRoutes.updateAttachments)

commentRouter.delete("/:commentId", Authentication, Validation(CV.deleteCommentSchema), commentRoutes.deleteComment)
export default commentRouter