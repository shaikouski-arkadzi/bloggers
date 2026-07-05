import { Router } from "express";
import { createBlog, getBlog, getBlogs } from "../controllers";
import { BLOGS_ROUTES } from "../constants";

const router = Router();

router.post(BLOGS_ROUTES.ROOT, createBlog);
router.get(BLOGS_ROUTES.ROOT, getBlogs);
router.get(BLOGS_ROUTES.BY_ID, getBlog);

export default router;
