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
import { blogExistsMiddleware, blogInputDtoValidation } from "../validation";
import { superAdminGuardMiddleware } from "../../auth/middleware";
import {
  contentValidation,
  shortDescriptionValidation,
  titleValidation,
} from "../../posts/validation/postInputDto.validation.middleware";

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
  resultValidationMiddleware,
  getBlogs,
);
router.get(
  BLOGS_ROUTES.BY_ID,
  idValidation,
  blogExistsMiddleware,
  resultValidationMiddleware,
  getBlog,
);
router.put(
  BLOGS_ROUTES.BY_ID,
  superAdminGuardMiddleware,
  idValidation,
  blogExistsMiddleware,
  blogInputDtoValidation,
  resultValidationMiddleware,
  updateBlog,
);
router.delete(
  BLOGS_ROUTES.BY_ID,
  superAdminGuardMiddleware,
  idValidation,
  blogExistsMiddleware,
  resultValidationMiddleware,
  deleteBlog,
);

router.get(
  BLOGS_ROUTES.BLOG_POSTS,
  idValidation,
  blogExistsMiddleware,
  paginationValidation,
  sortingValidation(BLOG_FIELDS),
  resultValidationMiddleware,
  getBlogPosts,
);

router.post(
  BLOGS_ROUTES.BLOG_POSTS,
  superAdminGuardMiddleware,
  idValidation,
  blogExistsMiddleware,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  resultValidationMiddleware,
  createBlogPost,
);

export default router;
