import { Router } from "express";
import { SECURITY_ROUTES } from "../constants";
import { resultValidationMiddleware } from "../../common/validation";
import { getDevices } from "../controllers";
import { refreshTokenValidationMiddleware } from "../../auth/middleware";

const router = Router();

router.get(
  SECURITY_ROUTES.DEVICES,
  refreshTokenValidationMiddleware,
  resultValidationMiddleware,
  getDevices,
);

export default router;
