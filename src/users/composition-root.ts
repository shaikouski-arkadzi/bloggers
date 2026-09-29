import { UserService } from "./application/user.service";
import { UserCommandRepository, UserQueryRepository } from "./repositories";

export const userCommandRepository = new UserCommandRepository();
export const userQueryRepository = new UserQueryRepository();

export const userService = new UserService(
  userCommandRepository,
  userQueryRepository,
);
