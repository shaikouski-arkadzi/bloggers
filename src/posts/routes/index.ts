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

const router = Router();

router.post(
  POSTS_ROUTES.ROOT,
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
  idValidation,
  postInputDtoValidation,
  resultValidationMiddleware,
  updatePost,
);
router.delete(
  POSTS_ROUTES.BY_ID,
  idValidation,
  resultValidationMiddleware,
  deletePost,
);

export default router;
