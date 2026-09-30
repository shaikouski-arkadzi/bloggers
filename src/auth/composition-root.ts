import {
  userCommandRepository,
  userQueryRepository,
  userService,
} from "../users/composition-root";
import { AuthService } from "./application";
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
