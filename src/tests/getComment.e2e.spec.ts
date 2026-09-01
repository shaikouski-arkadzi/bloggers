import request from "supertest";
import express from "express";
import { ADMIN_LOGIN, ADMIN_PASSWORD } from "../settings/config";
import { setupApp } from "../setup-app";
import { db } from "../db";

const app = express();

setupApp(app);

describe("GET /comments/:id", () => {
  let createdCommentId: number;

  let accessToken: string;
  let createdUserId: string;
  let createdPostId: string;

  const userLogin = "login";
  const commentBody = {
    content: "stringstringstringstring",
  };

  beforeAll(async () => {
    await db.connect();

    await request(app).delete("/testing/all-data").expect(204);

    const ADMIN_LOGIN_PASSWORD = `${ADMIN_LOGIN}:${ADMIN_PASSWORD}`;
    const ADMIN_TOKEN = Buffer.from(ADMIN_LOGIN_PASSWORD, "utf-8").toString(
      "base64",
    );

    const createUserBody = {
      login: userLogin,
      password: "password",
      email: "example@example.dev",
    };

    const createUserResponse = await request(app)
      .post("/users")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(createUserBody)
      .expect(201);

    createdUserId = createUserResponse.body.id;

    const loginUserBody = {
      loginOrEmail: createUserBody.login,
      password: createUserBody.password,
    };

    const loginUserResponse = await request(app)
      .post("/auth/login")
      .send(loginUserBody)
      .expect(200);

    accessToken = loginUserResponse.body.accessToken;

    const blogBody = {
      name: "string",
      description: "string",
      websiteUrl:
        "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYVik",
    };

    const createBlogResponse = await request(app)
      .post("/blogs")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(blogBody)
      .expect(201);

    const postBody = {
      title: "string",
      shortDescription: "string",
      content: "string",
      blogId: createBlogResponse.body.id,
    };

    const createPostResponse = await request(app)
      .post("/posts")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(postBody)
      .expect(201);

    createdPostId = createPostResponse.body.id;

    const createCommentResponse = await request(app)
      .post(`/posts/${createdPostId}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(commentBody)
      .expect(201);

    createdCommentId = createCommentResponse.body.id;
  }, 100000);

  afterAll(async () => {
    await db.disconnect();
  });

  it("should return 200 and comment by id", async () => {
    const response = await request(app)
      .get(`/comments/${createdCommentId}`)
      .expect(200);

    expect(response.body).toEqual({
      id: createdCommentId,
      content: commentBody.content,
      commentatorInfo: {
        userId: createdUserId,
        userLogin: userLogin,
      },
      createdAt: expect.stringMatching(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      ),
    });
  });

  it("should return 404 if id not exist", async () => {
    await request(app).get(`/comments/66d1f5a8c3e7429b8f1a6d30`).expect(404);
  });
});
