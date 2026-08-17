import { Router } from "express";
import { USERS_ROUTES } from "../constants";
import { superAdminGuardMiddleware } from "../middleware";
import { resultValidationMiddleware } from "../../common/validation";
import { userInputDtoValidation } from "../validation";
import { createUser } from "../controllers";

const router = Router();

router.post(
  USERS_ROUTES.ROOT,
  superAdminGuardMiddleware,
  userInputDtoValidation,
  resultValidationMiddleware,
  createUser,
);

export default router;
