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
import { blogInputDtoValidation } from "../validation";

const router = Router();

router.post(
  BLOGS_ROUTES.ROOT,
  blogInputDtoValidation,
  resultValidationMiddleware,
  createBlog,
);
router.get(BLOGS_ROUTES.ROOT, getBlogs);
router.get(BLOGS_ROUTES.BY_ID, idValidation, getBlog);
router.put(
  BLOGS_ROUTES.BY_ID,
  idValidation,
  blogInputDtoValidation,
  resultValidationMiddleware,
  updateBlog,
);
router.delete(
  BLOGS_ROUTES.BY_ID,
  idValidation,
  resultValidationMiddleware,
  deleteBlog,
);

export default router;
