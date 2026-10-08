import { Request, Response } from "express";
import { TestingService } from "../application/testing.service";
import { inject, injectable } from "inversify";

@injectable()
export class TestingController {
  constructor(
    @inject(TestingService)
    private testingService: TestingService,
  ) {}

  clearDB = async (req: Request, res: Response) => {
    try {
      await this.testingService.clearDB();

      return res.sendStatus(204);
    } catch (error) {
      return res.sendStatus(500);
    }
  };
}
