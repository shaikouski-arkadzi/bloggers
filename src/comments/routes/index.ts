import { Router } from "express";
import { COMMENTS_ROUTES } from "../constants";
import { deleteComment, getComment, updateComment } from "../controllers";
import { jwtValidationMiddleware } from "../../auth/middleware";

const router = Router();

router.get(COMMENTS_ROUTES.BY_ID, getComment);
router.put(COMMENTS_ROUTES.BY_ID, jwtValidationMiddleware, updateComment);
router.delete(COMMENTS_ROUTES.BY_ID, jwtValidationMiddleware, deleteComment);

export default router;
