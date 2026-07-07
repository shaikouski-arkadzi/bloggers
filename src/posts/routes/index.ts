import { Router } from "express";
import { createPost, deletePost, getPost, getPosts, updatePost } from "../controllers";
import { POSTS_ROUTES } from "../constants";

const router = Router();

router.post(POSTS_ROUTES.ROOT, createPost);
router.get(POSTS_ROUTES.ROOT, getPosts);
router.get(POSTS_ROUTES.BY_ID, getPost);
router.put(POSTS_ROUTES.BY_ID, updatePost);
router.delete(POSTS_ROUTES.BY_ID, deletePost);

export default router;
