import { Router } from "express";
import { createBlog } from "../controllers";
import { BLOGS_ROUTES } from "../constants";

const router = Router();

router.post(BLOGS_ROUTES.ROOT, createBlog);

export default router;
