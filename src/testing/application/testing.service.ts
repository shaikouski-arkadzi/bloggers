import { TestingCommandRepository } from "../repositories";

export class TestingService {
  constructor(private testingCommandRepository: TestingCommandRepository) {}

  async clearDB(): Promise<void> {
    await this.testingCommandRepository.clearDB();
  }
}
