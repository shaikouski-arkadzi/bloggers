import { Request, Response } from "express";
import { TestingService } from "../application/testing.service";

export class TestingController {
  constructor(private testingService: TestingService) {}

  clearDB = async (req: Request, res: Response) => {
    try {
      await this.testingService.clearDB();

      return res.sendStatus(204);
    } catch (error) {
      return res.sendStatus(500);
    }
  };
}
