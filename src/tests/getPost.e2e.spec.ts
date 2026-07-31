import request from "supertest";
import express from "express";
import { BLOGS_PATH } from "../blogs/constants";
import { POSTS_PATH } from "../posts/constants";
import { ADMIN_LOGIN, ADMIN_PASSWORD } from "../settings/config";
import { setupApp } from "../setup-app";
import { db } from "../db";

let ADMIN_LOGIN_PASSWORD: string;
let ADMIN_TOKEN: string;

const app = express();

setupApp(app);

describe("GET /posts/:id", () => {
  beforeAll(async () => {
    await db.connect();

    await request(app).delete("/testing/all-data").expect(204);

    ADMIN_LOGIN_PASSWORD = `${ADMIN_LOGIN}:${ADMIN_PASSWORD}`;
    ADMIN_TOKEN = Buffer.from(ADMIN_LOGIN_PASSWORD, "utf-8").toString("base64");
  });

  afterAll(async () => {
    await db.disconnect();
  });

  it("should get post by id", async () => {
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

    const createPostResponse = await request(app)
      .post(POSTS_PATH)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(postBody)
      .expect(201);

    const getPostResponse = await request(app)
      .get(`${POSTS_PATH}/${createPostResponse.body.id}`)
      .expect(200);

    expect(getPostResponse.body).toEqual({
      id: expect.stringMatching(/^[0-9a-fA-F]{24}$/),
      title: "string",
      shortDescription: "string",
      content: "string",
      blogId: expect.stringMatching(/^[0-9a-fA-F]{24}$/),
      blogName: "string",
      createdAt: expect.stringMatching(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      ),
    });
  });

  it("should return 404 if post does not exist", async () => {
    await request(app).get("/posts/test").expect(404);
  });
});
