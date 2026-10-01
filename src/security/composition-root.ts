import {
  authCommandRepository,
  authQueryRepository,
} from "../auth/composition-root";
import { SecurityService } from "./application/security.service";
import {
  SecurityCommandRepository,
  SecurityQueryRepository,
} from "./repositories";

export const securityCommandRepository = new SecurityCommandRepository();
export const securityQueryRepository = new SecurityQueryRepository();

export const securityService = new SecurityService(
  authCommandRepository,
  authQueryRepository,
);
