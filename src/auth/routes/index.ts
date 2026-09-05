import { Router } from "express";
import { resultValidationMiddleware } from "../../common/validation";
import { AUTH_ROUTES } from "../constants";
import { loginUser, registerUser, userInfo } from "../controllers";
import { loginInputDtoValidation } from "../validation";
import { jwtValidationMiddleware } from "../middleware";

const router = Router();

router.post(
  AUTH_ROUTES.LOGIN,
  loginInputDtoValidation,
  resultValidationMiddleware,
  loginUser,
);

router.get(AUTH_ROUTES.ME, jwtValidationMiddleware, userInfo);

router.post(AUTH_ROUTES.REGISTRATION, registerUser);

export default router;
