import { Router } from "express";
import {
  createBlog,
  createBlogPost,
  deleteBlog,
  getBlog,
  getBlogPosts,
  getBlogs,
  updateBlog,
} from "../controllers";
import { BLOG_FIELDS, BLOGS_ROUTES } from "../constants";
import {
  idValidation,
  paginationValidation,
  resultValidationMiddleware,
  sortingValidation,
} from "../../common/validation";
import {
  blogInputDtoValidation,
  searchNameTermValidation,
} from "../validation";
import { superAdminGuardMiddleware } from "../../auth/middleware";
import {
  contentValidation,
  shortDescriptionValidation,
  titleValidation,
} from "../../posts/validation/postInputDto.validation.middleware";
import { POST_FIELDS } from "../../posts/constants";

const router = Router();

router.post(
  BLOGS_ROUTES.ROOT,
  superAdminGuardMiddleware,
  blogInputDtoValidation,
  resultValidationMiddleware,
  createBlog,
);
router.get(
  BLOGS_ROUTES.ROOT,
  paginationValidation,
  sortingValidation(BLOG_FIELDS),
  searchNameTermValidation,
  resultValidationMiddleware,
  getBlogs,
);
router.get(
  BLOGS_ROUTES.BY_ID,
  idValidation,
  resultValidationMiddleware,
  getBlog,
);
router.put(
  BLOGS_ROUTES.BY_ID,
  superAdminGuardMiddleware,
  idValidation,
  blogInputDtoValidation,
  resultValidationMiddleware,
  updateBlog,
);
router.delete(
  BLOGS_ROUTES.BY_ID,
  superAdminGuardMiddleware,
  idValidation,
  resultValidationMiddleware,
  deleteBlog,
);

router.get(
  BLOGS_ROUTES.BLOG_POSTS,
  idValidation,
  paginationValidation,
  sortingValidation(POST_FIELDS),
  resultValidationMiddleware,
  getBlogPosts,
);

router.post(
  BLOGS_ROUTES.BLOG_POSTS,
  superAdminGuardMiddleware,
  idValidation,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  resultValidationMiddleware,
  createBlogPost,
);

export default router;
