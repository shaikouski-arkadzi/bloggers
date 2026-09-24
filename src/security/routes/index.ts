import { Router } from "express";
import { SECURITY_ROUTES } from "../constants";
import {
  idValidation,
  resultValidationMiddleware,
} from "../../common/validation";
import {
  deleteDevice,
  deleteDevicesExceptCurrent,
  getDevices,
} from "../controllers";
import { refreshTokenValidationMiddleware } from "../../auth/middleware";

const router = Router();

router.get(
  SECURITY_ROUTES.DEVICES,
  refreshTokenValidationMiddleware,
  resultValidationMiddleware,
  getDevices,
);

router.delete(
  SECURITY_ROUTES.DEVICES,
  refreshTokenValidationMiddleware,
  resultValidationMiddleware,
  deleteDevicesExceptCurrent,
);

router.delete(
  SECURITY_ROUTES.DEVICE_BY_ID,
  refreshTokenValidationMiddleware,
  idValidation,
  resultValidationMiddleware,
  deleteDevice,
);

export default router;
