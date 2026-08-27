import { Router } from "express";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controllers";
import { POST_FIELDS, POSTS_ROUTES } from "../constants";
import {
  idValidation,
  paginationValidation,
  resultValidationMiddleware,
  sortingValidation,
} from "../../common/validation";
import { postInputDtoValidation } from "../validation";
import { superAdminGuardMiddleware } from "../../auth/middleware";
import { COMMENT_FIELDS } from "../../comments/constants";
import { getPostComments } from "../../comments/controllers";

const router = Router();

router.post(
  POSTS_ROUTES.ROOT,
  superAdminGuardMiddleware,
  postInputDtoValidation,
  resultValidationMiddleware,
  createPost,
);
router.get(
  POSTS_ROUTES.ROOT,
  paginationValidation,
  sortingValidation(POST_FIELDS),
  resultValidationMiddleware,
  getPosts,
);
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

router.get(
  POSTS_ROUTES.POST_COMMENTS,
  paginationValidation,
  sortingValidation(COMMENT_FIELDS),
  resultValidationMiddleware,
  getPostComments,
);

export default router;
