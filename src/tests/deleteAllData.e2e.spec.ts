import request from "supertest";
import express from "express";
import { db } from "../db";
import blogsRoutes from "../blogs/routes";
import postsRoutes from "../posts/routes";
import testingRoutes from "../testing/routes";
import { BLOGS_PATH } from "../blogs/constants";
import { POSTS_PATH } from "../posts/constants";
import { TESTING_PATH, TESTING_ROUTES } from "../testing/constants";

const app = express();

app.use(express.json());

app.use(TESTING_PATH, testingRoutes);
app.use(BLOGS_PATH, blogsRoutes);
app.use(POSTS_PATH, postsRoutes);

describe("DELETE /testing/all-data", () => {
  beforeAll(() => {
    db.blogs.length = 0;
    db.posts.length = 0;
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
      .send(body)
      .expect(201);

    const postBody = {
      title: "string",
      shortDescription: "string",
      content: "string",
      blogId: createBlogResponse.body.id,
    };

    await request(app).post(POSTS_PATH).send(postBody).expect(201);

    await request(app)
      .delete(`${TESTING_PATH}${TESTING_ROUTES.ALL_DATA}`)
      .expect(204);
  });
});
