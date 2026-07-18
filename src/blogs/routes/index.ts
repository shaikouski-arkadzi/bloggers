import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getBlog,
  getBlogs,
  updateBlog,
} from "../controllers";
import { BLOGS_ROUTES } from "../constants";
import {
  idValidation,
  resultValidationMiddleware,
} from "../../common/validation";
import { blogExistsMiddleware, blogInputDtoValidation } from "../validation";
import { superAdminGuardMiddleware } from "../../auth/middleware";

const router = Router();

router.post(
  BLOGS_ROUTES.ROOT,
  superAdminGuardMiddleware,
  blogInputDtoValidation,
  resultValidationMiddleware,
  createBlog,
);
router.get(BLOGS_ROUTES.ROOT, getBlogs);
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

export default router;
