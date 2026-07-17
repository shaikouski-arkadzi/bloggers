import { Router } from "express";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controllers";
import { POSTS_ROUTES } from "../constants";
import {
  idValidation,
  resultValidationMiddleware,
} from "../../common/validation";
import { postInputDtoValidation } from "../validation";
import { superAdminGuardMiddleware } from "../../auth/middleware";

const router = Router();

router.post(
  POSTS_ROUTES.ROOT,
  superAdminGuardMiddleware,
  postInputDtoValidation,
  resultValidationMiddleware,
  createPost,
);
router.get(POSTS_ROUTES.ROOT, getPosts);
router.get(
  POSTS_ROUTES.BY_ID,
  idValidation,
  resultValidationMiddleware,
  getPost,
);
router.put(
  POSTS_ROUTES.BY_ID,
  superAdminGuardMiddleware,
  idValidation,
  postInputDtoValidation,
  resultValidationMiddleware,
  updatePost,
);
router.delete(
  POSTS_ROUTES.BY_ID,
  superAdminGuardMiddleware,
  idValidation,
  resultValidationMiddleware,
  deletePost,
);

export default router;
