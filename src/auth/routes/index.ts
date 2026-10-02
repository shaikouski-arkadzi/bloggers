import { Router } from "express";
import { resultValidationMiddleware } from "../../common/validation";
import { AUTH_ROUTES } from "../constants";
import {
  loginInputDtoValidation,
  newPasswordRecoveryInputModelValidation,
} from "../validation";
import {
  jwtValidationMiddleware,
  reqRateLimitMiddleware,
  refreshTokenValidationMiddleware,
} from "../middleware";
import { userInputDtoValidation } from "../../users/validation";
import { emailValidation } from "../../users/validation/userInputDto.validation.middleware";
import { authController } from "../composition-root";

const router = Router();

const {
  loginUser,
  userInfo,
  updateTokens,
  registerUser,
  resendRegistrationEmail,
  confirmRegistration,
  logout,
  resetPassword,
  newPassword,
} = authController;

router.post(
  AUTH_ROUTES.LOGIN,
  reqRateLimitMiddleware,
  loginInputDtoValidation,
  resultValidationMiddleware,
  loginUser,
);

router.get(AUTH_ROUTES.ME, jwtValidationMiddleware, userInfo);

router.post(
  AUTH_ROUTES.REGISTRATION,
  reqRateLimitMiddleware,
  userInputDtoValidation,
  resultValidationMiddleware,
  registerUser,
);

router.post(
  AUTH_ROUTES.REGISTRATION_EMAIL_RESENDING,
  reqRateLimitMiddleware,
  emailValidation,
  resultValidationMiddleware,
  resendRegistrationEmail,
);

router.post(
  AUTH_ROUTES.REGISTRATION_CONFIRMATION,
  reqRateLimitMiddleware,
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

router.post(
  AUTH_ROUTES.PASSWORD_RECOVERY,
  reqRateLimitMiddleware,
  emailValidation,
  resultValidationMiddleware,
  resetPassword,
);

router.post(
  AUTH_ROUTES.NEW_PASSWORD,
  reqRateLimitMiddleware,
  newPasswordRecoveryInputModelValidation,
  resultValidationMiddleware,
  newPassword,
);

export default router;
