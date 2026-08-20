import { Router } from "express";
import { resultValidationMiddleware } from "../../common/validation";
import { AUTH_ROUTES } from "../constants";
import { loginUser } from "../controllers";
import { loginInputDtoValidation } from "../validation";

const router = Router();

router.post(
  AUTH_ROUTES.LOGIN,
  loginInputDtoValidation,
  resultValidationMiddleware,
  loginUser,
);

export default router;
