import { Router } from "express";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controllers";
import { POSTS_ROUTES } from "../constants";
import { idValidation } from "../../common/validation";

const router = Router();

router.post(POSTS_ROUTES.ROOT, createPost);
router.get(POSTS_ROUTES.ROOT, getPosts);
router.get(POSTS_ROUTES.BY_ID, idValidation, getPost);
router.put(POSTS_ROUTES.BY_ID, idValidation, updatePost);
router.delete(POSTS_ROUTES.BY_ID, idValidation, deletePost);

export default router;
