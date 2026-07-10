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

describe("GET /posts/:id", () => {
  beforeAll(() => {
    db.blogs.length = 0
    db.posts.length = 0
  });

  it("should get all posts", async () => {
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

    await request(app)
      .post(POSTS_PATH)
      .send(postBody)
      .expect(201);

    const getPostsResponse = await request(app)
      .get(POSTS_PATH)
      .expect(200);

    expect(db.posts.length).toBe(getPostsResponse.body.length);

    expect(db.posts.length).toBe(1);

    expect(getPostsResponse.body).toEqual([{
      id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
      title: "string",
      shortDescription: "string",
      content: "string",
      blogId: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
      blogName: "string"
    }]);
  });
});