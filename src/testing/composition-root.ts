import { TestingService } from "./application/testing.service";
import { TestingController } from "./controllers/clearDB.controller";
import {
  TestingCommandRepository,
  TestingQueryRepository,
} from "./repositories";

export const testingCommandRepository = new TestingCommandRepository();
export const testingQueryRepository = new TestingQueryRepository();

export const testingService = new TestingService(testingCommandRepository);

export const testingController = new TestingController(testingService);
