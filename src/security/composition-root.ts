import { container } from "../settings/container";
import {
  AuthCommandRepository,
  AuthQueryRepository,
} from "../auth/repositories";
import { SecurityService } from "./application/security.service";
import { SecurityController } from "./controllers/security.controllers";
import {
  SecurityCommandRepository,
  SecurityQueryRepository,
} from "./repositories";

export const securityCommandRepository = new SecurityCommandRepository();
export const securityQueryRepository = new SecurityQueryRepository();

export const securityService = new SecurityService(
  container.get(AuthCommandRepository),
  container.get(AuthQueryRepository),
);

export const securityController = new SecurityController(
  securityService,
  securityQueryRepository,
);
