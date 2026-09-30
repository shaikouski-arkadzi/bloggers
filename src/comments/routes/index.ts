import { Router } from "express";
import { COMMENTS_ROUTES } from "../constants";
import { commentsController } from "../composition-root";
import { jwtValidationMiddleware } from "../../auth/middleware";
import { contentValidation } from "../validation";
import { resultValidationMiddleware } from "../../common/validation";

const router = Router();

const { getComment, updateComment, deleteComment } = commentsController;

router.get(COMMENTS_ROUTES.BY_ID, getComment);
router.put(
  COMMENTS_ROUTES.BY_ID,
  jwtValidationMiddleware,
  contentValidation,
  resultValidationMiddleware,
  updateComment,
);
router.delete(COMMENTS_ROUTES.BY_ID, jwtValidationMiddleware, deleteComment);

export default router;
