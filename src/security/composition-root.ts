import { container } from "../settings/container";
import { SecurityService } from "./application/security.service";
import { SecurityController } from "./controllers/security.controllers";
import {
  SecurityCommandRepository,
  SecurityQueryRepository,
} from "./repositories";

container.bind(SecurityCommandRepository).to(SecurityCommandRepository);
container.bind(SecurityQueryRepository).to(SecurityQueryRepository);

container.bind(SecurityService).to(SecurityService);

container.bind(SecurityController).to(SecurityController);

export const securityController = container.get(SecurityController);
