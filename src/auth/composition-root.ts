import {
  userCommandRepository,
  userQueryRepository,
  userService,
} from "../users/composition-root";
import { AuthService } from "./application";
import { AuthController } from "./controllers/auth.controllers";
import { AuthCommandRepository, AuthQueryRepository } from "./repositories";

export const authCommandRepository = new AuthCommandRepository();
export const authQueryRepository = new AuthQueryRepository();

export const authService = new AuthService(
  userCommandRepository,
  userQueryRepository,
  userService,
  authCommandRepository,
  authQueryRepository,
);

export const authController = new AuthController(authService, userService);
