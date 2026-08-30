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
import {
  jwtValidationMiddleware,
  superAdminGuardMiddleware,
} from "../../auth/middleware";
import { COMMENT_FIELDS } from "../../comments/constants";
import { createPostComment, getPostComments } from "../../comments/controllers";
import { contentValidation } from "../../comments/validation";

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

router.post(
  POSTS_ROUTES.POST_COMMENTS,
  jwtValidationMiddleware,
  contentValidation,
  resultValidationMiddleware,
  createPostComment,
);

export default router;
