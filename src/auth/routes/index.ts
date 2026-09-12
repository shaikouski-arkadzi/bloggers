import { Router } from "express";
import { resultValidationMiddleware } from "../../common/validation";
import { AUTH_ROUTES } from "../constants";
import {
  confirmRegistration,
  loginUser,
  registerUser,
  resendRegistrationEmail,
  updateTokens,
  userInfo,
} from "../controllers";
import { loginInputDtoValidation } from "../validation";
import {
  jwtValidationMiddleware,
  refreshTokenValidationMiddleware,
} from "../middleware";
import { userInputDtoValidation } from "../../users/validation";
import { emailValidation } from "../../users/validation/userInputDto.validation.middleware";
import { logout } from "../controllers/logout.controller";

const router = Router();

router.post(
  AUTH_ROUTES.LOGIN,
  loginInputDtoValidation,
  resultValidationMiddleware,
  loginUser,
);

router.get(AUTH_ROUTES.ME, jwtValidationMiddleware, userInfo);

router.post(
  AUTH_ROUTES.REGISTRATION,
  userInputDtoValidation,
  resultValidationMiddleware,
  registerUser,
);

router.post(
  AUTH_ROUTES.REGISTRATION_EMAIL_RESENDING,
  emailValidation,
  resultValidationMiddleware,
  resendRegistrationEmail,
);

router.post(
  AUTH_ROUTES.REGISTRATION_CONFIRMATION,
  resultValidationMiddleware,
  confirmRegistration,
);

router.post(
  AUTH_ROUTES.REFRESH_TOKEN,
  refreshTokenValidationMiddleware,
  resultValidationMiddleware,
  updateTokens,
);

router.post(
  AUTH_ROUTES.LOGOUT,
  refreshTokenValidationMiddleware,
  resultValidationMiddleware,
  logout,
);

export default router;
