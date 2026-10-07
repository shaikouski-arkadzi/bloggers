import { container } from "../settings/container";
import { AuthService } from "./application";
import { AuthController } from "./controllers/auth.controllers";
import { AuthCommandRepository, AuthQueryRepository } from "./repositories";

container.bind(AuthCommandRepository).to(AuthCommandRepository);
container.bind(AuthQueryRepository).to(AuthQueryRepository);

container.bind(AuthService).to(AuthService);

container.bind(AuthController).to(AuthController);

export const authController = container.get(AuthController);
