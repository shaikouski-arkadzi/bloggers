import express, { Express } from "express";
import blogsRoutes from "./blogs/routes";
import postsRoutes from "./posts/routes";
import testingRoutes from "./testing/routes";
import usersRoutes from "./users/routes";
import authRoutes from "./auth/routes";
import commentsRoutes from "./comments/routes";
import { BLOGS_PATH } from "./blogs/constants";
import { POSTS_PATH } from "./posts/constants";
import { AUTH_PATH } from "./auth/constants";
import { TESTING_PATH } from "./testing/constants";
import { USERS_PATH } from "./users/constants";
import { COMMENTS_PATH } from "./comments/constants";

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса

  app.use(BLOGS_PATH, blogsRoutes);

  app.use(POSTS_PATH, postsRoutes);

  app.use(USERS_PATH, usersRoutes);

  app.use(AUTH_PATH, authRoutes);

  app.use(COMMENTS_PATH, commentsRoutes);

  app.use(TESTING_PATH, testingRoutes);

  return app;
};
