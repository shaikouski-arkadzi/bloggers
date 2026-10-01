import { Router } from "express";
import { TESTING_ROUTES } from "../constants";
import { testingController } from "../composition-root";

const router = Router();

router.delete(TESTING_ROUTES.ALL_DATA, testingController.clearDB);

export default router;
