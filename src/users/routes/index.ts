import { Router } from "express";
import { USERS_FIELDS, USERS_ROUTES } from "../constants";
import { superAdminGuardMiddleware } from "../../auth/middleware";
import {
  idValidation,
  paginationValidation,
  resultValidationMiddleware,
  sortingValidation,
} from "../../common/validation";
import { searchTermValidation, userInputDtoValidation } from "../validation";
import { createUser, deleteUser, getUsers } from "../controllers";

const router = Router();

router.post(
  USERS_ROUTES.ROOT,
  superAdminGuardMiddleware,
  userInputDtoValidation,
  resultValidationMiddleware,
  createUser,
);
router.get(
  USERS_ROUTES.ROOT,
  paginationValidation,
  sortingValidation(USERS_FIELDS),
  searchTermValidation,
  resultValidationMiddleware,
  getUsers,
);
router.delete(
  USERS_ROUTES.BY_ID,
  superAdminGuardMiddleware,
  idValidation,
  resultValidationMiddleware,
  deleteUser,
);

export default router;
