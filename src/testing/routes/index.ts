import { Router } from "express";
import { TESTING_ROUTES } from "../constants";
import { clearDB } from "../controllers/clearDB.controller";

const router = Router();

router.delete(TESTING_ROUTES.ALL_DATA, clearDB);

export default router;
