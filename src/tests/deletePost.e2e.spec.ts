import request from "supertest";
import express from "express";
import { db } from "../db";
import blogsRoutes from "../blogs/routes";
import postsRoutes from "../posts/routes";
import { BLOGS_PATH } from "../blogs/constants";
import { POSTS_PATH } from "../posts/constants";

const app = express();

app.use(express.json());
app.use(BLOGS_PATH, blogsRoutes);
app.use(POSTS_PATH, postsRoutes);

describe("DELETE /posts/:id", () => {
  beforeAll(() => {
    db.blogs.length = 0
    db.posts.length = 0
  });

  it("should delete post by id", async () => {
    const body = {
      name: "string",
      description: "string",
      websiteUrl: "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYVik"
    };

    const createBlogResponse = await request(app)
      .post(BLOGS_PATH)
      .send(body)
      .expect(201);

    const postBody = {
      title: "string",
      shortDescription: "string",
      content: "string",
      blogId: createBlogResponse.body.id
    }

    const createPostResponse = await request(app)
      .post(POSTS_PATH)
      .send(postBody)
      .expect(201);

    await request(app)
      .delete(`/posts/${createPostResponse.body.id}`)
      .expect(204);
  });

  it("should return 404 if post does not exist", async () => {
    await request(app).delete("/posts/test").expect(404);
  });
});