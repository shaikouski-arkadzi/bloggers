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
import { postExistsMiddleware, postInputDtoValidation } from "../validation";
import { superAdminGuardMiddleware } from "../../auth/middleware";

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
  postExistsMiddleware,
  resultValidationMiddleware,
  getPost,
);
router.put(
  POSTS_ROUTES.BY_ID,
  superAdminGuardMiddleware,
  idValidation,
  postExistsMiddleware,
  postInputDtoValidation,
  resultValidationMiddleware,
  updatePost,
);
router.delete(
  POSTS_ROUTES.BY_ID,
  superAdminGuardMiddleware,
  idValidation,
  postExistsMiddleware,
  resultValidationMiddleware,
  deletePost,
);

export default router;
