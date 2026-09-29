import { UserService } from "./application/user.service";
import { UsersController } from "./controllers/users.controllers";
import { UserCommandRepository, UserQueryRepository } from "./repositories";

export const userCommandRepository = new UserCommandRepository();
export const userQueryRepository = new UserQueryRepository();

export const userService = new UserService(
  userCommandRepository,
  userQueryRepository,
);

export const usersController = new UsersController(
  userService,
  userQueryRepository,
);
