import request from "supertest";
import express from "express";
import { db } from "../db";
import blogsRoutes from "../blogs/routes";
import postsRoutes from "../posts/routes";
import testingRoutes from "../testing/routes";
import { BLOGS_PATH } from "../blogs/constants";
import { POSTS_PATH } from "../posts/constants";
import { TESTING_PATH, TESTING_ROUTES } from "../testing/constants";
import { ADMIN_LOGIN, ADMIN_PASSWORD } from "../settings/config";

let ADMIN_LOGIN_PASSWORD: string;
let ADMIN_TOKEN: string;

const app = express();

app.use(express.json());

app.use(TESTING_PATH, testingRoutes);
app.use(BLOGS_PATH, blogsRoutes);
app.use(POSTS_PATH, postsRoutes);

describe("DELETE /testing/all-data", () => {
  beforeAll(() => {
    db.blogs.length = 0;
    db.posts.length = 0;

    ADMIN_LOGIN_PASSWORD = `${ADMIN_LOGIN}:${ADMIN_PASSWORD}`;
    ADMIN_TOKEN = Buffer.from(ADMIN_LOGIN_PASSWORD, "utf-8").toString("base64");
  });

  it("should delete all data", async () => {
    const body = {
      name: "string",
      description: "string",
      websiteUrl:
        "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYVik",
    };

    const createBlogResponse = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(body)
      .expect(201);

    const postBody = {
      title: "string",
      shortDescription: "string",
      content: "string",
      blogId: createBlogResponse.body.id,
    };

    await request(app)
      .post(POSTS_PATH)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(postBody)
      .expect(201);

    await request(app)
      .delete(`${TESTING_PATH}${TESTING_ROUTES.ALL_DATA}`)
      .expect(204);
  });
});
