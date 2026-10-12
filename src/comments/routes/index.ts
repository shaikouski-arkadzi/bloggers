import { Router } from "express";
import { COMMENTS_ROUTES } from "../constants";
import { commentsController } from "../composition-root";
import { jwtValidationMiddleware } from "../../auth/middleware";
import { contentValidation, likeStatusInputValidation } from "../validation";
import { resultValidationMiddleware } from "../../common/validation";

const router = Router();

const { getComment, updateComment, deleteComment, setLikeStatus } =
  commentsController;

router.get(COMMENTS_ROUTES.BY_ID, getComment);
router.put(
  COMMENTS_ROUTES.BY_ID,
  jwtValidationMiddleware,
  contentValidation,
  resultValidationMiddleware,
  updateComment,
);
router.delete(COMMENTS_ROUTES.BY_ID, jwtValidationMiddleware, deleteComment);

router.put(
  COMMENTS_ROUTES.BY_ID_LIKE_STATUS,
  jwtValidationMiddleware,
  likeStatusInputValidation,
  resultValidationMiddleware,
  setLikeStatus,
);

export default router;
