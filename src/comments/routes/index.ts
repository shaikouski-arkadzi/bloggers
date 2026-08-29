import { Router } from "express";
import { COMMENTS_ROUTES } from "../constants";
import { getComment } from "../controllers";

const router = Router();

router.get(COMMENTS_ROUTES.BY_ID, getComment);

export default router;
