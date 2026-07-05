import express, { Express } from "express";
import blogsRoutes from "./blogs/routes";
import testingRoutes from "./testing/routes";
import { BLOGS_PATH } from "./blogs/constants";
import { TESTING_PATH } from "./testing/constants";

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса

  app.use(BLOGS_PATH, blogsRoutes);

  app.use(TESTING_PATH, testingRoutes);

  return app;
};
