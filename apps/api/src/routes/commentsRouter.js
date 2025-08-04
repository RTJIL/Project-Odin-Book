import { Router } from "express";
import { commentsController } from "../controllers/commentsController.js";

export const commentsRouter = Router()

commentsRouter.post("/:postId", commentsController.createComment)

commentsRouter.patch("/:commentId", commentsController.updateComment)

commentsRouter.delete("/:commentId", commentsController.deleteComment)