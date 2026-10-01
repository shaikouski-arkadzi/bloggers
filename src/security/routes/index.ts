import { Router } from "express";
import { SECURITY_ROUTES } from "../constants";
import {
  idValidation,
  resultValidationMiddleware,
} from "../../common/validation";

import { refreshTokenValidationMiddleware } from "../../auth/middleware";
import { securityController } from "../composition-root";

const router = Router();

const { getDevices, deleteDevice, deleteDevicesExceptCurrent } =
  securityController;

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
