import { container } from "../settings/container";
import { TestingService } from "./application/testing.service";
import { TestingController } from "./controllers/clearDB.controller";
import {
  TestingCommandRepository,
  TestingQueryRepository,
} from "./repositories";

container.bind(TestingCommandRepository).to(TestingCommandRepository);
container.bind(TestingQueryRepository).to(TestingQueryRepository);

container.bind(TestingService).to(TestingService);

container.bind(TestingController).to(TestingController);

export const testingController = container.get(TestingController);
