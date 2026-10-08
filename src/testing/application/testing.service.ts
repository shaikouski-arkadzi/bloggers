import { inject, injectable } from "inversify";
import { TestingCommandRepository } from "../repositories";

@injectable()
export class TestingService {
  constructor(
    @inject(TestingCommandRepository)
    private testingCommandRepository: TestingCommandRepository,
  ) {}

  async clearDB(): Promise<void> {
    await this.testingCommandRepository.clearDB();
  }
}
