import express, { Express } from "express";
import blogsRoutes from "./blogs/routes";
import postsRoutes from "./posts/routes";
import testingRoutes from "./testing/routes";
import { BLOGS_PATH } from "./blogs/constants";
import { POSTS_PATH } from "./posts/constants";
import { TESTING_PATH } from "./testing/constants";

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса

  app.use(BLOGS_PATH, blogsRoutes);

  app.use(POSTS_PATH, postsRoutes);

  app.use(TESTING_PATH, testingRoutes);

  return app;
};
