import { Router } from "express";
import { resultValidationMiddleware } from "../../common/validation";
import { AUTH_ROUTES } from "../constants";
import {
  confirmRegistration,
  loginUser,
  registerUser,
  resendRegistrationEmail,
  userInfo,
} from "../controllers";
import { loginInputDtoValidation } from "../validation";
import { jwtValidationMiddleware } from "../middleware";
import { userInputDtoValidation } from "../../users/validation";
import { emailValidation } from "../../users/validation/userInputDto.validation.middleware";

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

export default router;
