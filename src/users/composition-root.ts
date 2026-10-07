import { container } from "../settings/container";
import { UserService } from "./application/user.service";
import { UsersController } from "./controllers/users.controllers";
import { UserCommandRepository, UserQueryRepository } from "./repositories";

container.bind(UserCommandRepository).to(UserCommandRepository);
container.bind(UserQueryRepository).to(UserQueryRepository);

container.bind(UserService).to(UserService);

container.bind(UsersController).to(UsersController);

export const usersController = container.get(UsersController);
