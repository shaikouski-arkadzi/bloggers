import express, { Express } from "express";
import blogsRoutes from "./blogs/routes";
import { BLOGS_PATH } from "./blogs/constants";

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса

  app.use(BLOGS_PATH, blogsRoutes);

  return app;
};
