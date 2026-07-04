import { Router } from "express";
import { createBlog, getBlogs } from "../controllers";
import { BLOGS_ROUTES } from "../constants";

const router = Router();

router.post(BLOGS_ROUTES.ROOT, createBlog);
router.get(BLOGS_ROUTES.ROOT, getBlogs);

export default router;
