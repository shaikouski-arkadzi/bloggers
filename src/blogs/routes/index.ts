import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getBlog,
  getBlogs,
  updateBlog,
} from "../controllers";
import { BLOGS_ROUTES } from "../constants";
import { idValidation } from "../../common/validation";

const router = Router();

router.post(BLOGS_ROUTES.ROOT, createBlog);
router.get(BLOGS_ROUTES.ROOT, getBlogs);
router.get(BLOGS_ROUTES.BY_ID, idValidation, getBlog);
router.put(BLOGS_ROUTES.BY_ID, idValidation, updateBlog);
router.delete(BLOGS_ROUTES.BY_ID, idValidation, deleteBlog);

export default router;
