import request from "supertest";
import express from "express";
import { ADMIN_LOGIN, ADMIN_PASSWORD } from "../settings/config";
import { setupApp } from "../setup-app";
import { db } from "../db";

const app = express();

setupApp(app);

let accessToken: string;
let createdUserId: string;
let createdPostId: string;

const userLogin = "login";

describe("POST /posts/:postId/comments", () => {
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
  }, 100000);

  afterAll(async () => {
    await db.disconnect();
  });

  it("should create comment for post", async () => {
    const commentBody = {
      content: "s".repeat(21),
    };

    const createCommentResponse = await request(app)
      .post(`/posts/${createdPostId}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(commentBody)
      .expect(201);

    expect(createCommentResponse.body).toEqual({
      id: expect.stringMatching(/^[0-9a-fA-F]{24}$/),
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

  it("should return 400 if content is missing", async () => {
    const commentBody = {};

    const createCommentResponse = await request(app)
      .post(`/posts/${createdPostId}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(commentBody);

    expect(createCommentResponse.statusCode).toEqual(400);

    expect(createCommentResponse.body).toEqual({
      errorsMessages: [
        {
          message: "Поле обязательное",
          field: "content",
        },
      ],
    });
  });

  it("should return 400 if content is empty", async () => {
    const commentBody = {
      content: " ",
    };

    const createCommentResponse = await request(app)
      .post(`/posts/${createdPostId}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(commentBody);

    expect(createCommentResponse.statusCode).toEqual(400);

    expect(createCommentResponse.body).toEqual({
      errorsMessages: [
        {
          message: "Поле не должно быть пустым",
          field: "content",
        },
      ],
    });
  });

  it("should return 400 if content is not string", async () => {
    const commentBody = {
      content: 1,
    };

    const createCommentResponse = await request(app)
      .post(`/posts/${createdPostId}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(commentBody);

    expect(createCommentResponse.statusCode).toEqual(400);

    expect(createCommentResponse.body).toEqual({
      errorsMessages: [
        {
          message: "Поле должно быть типом string",
          field: "content",
        },
      ],
    });
  });

  it("should return 400 if content less than 20 chars", async () => {
    const commentBody = {
      content: "a".repeat(19),
    };

    const createCommentResponse = await request(app)
      .post(`/posts/${createdPostId}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(commentBody);

    expect(createCommentResponse.statusCode).toEqual(400);

    expect(createCommentResponse.body).toEqual({
      errorsMessages: [
        {
          message: "Длина должан быть от 20 до 300",
          field: "content",
        },
      ],
    });
  });

  it("should return 400 if content more than 300 chars", async () => {
    const commentBody = {
      content: "a".repeat(301),
    };

    const createCommentResponse = await request(app)
      .post(`/posts/${createdPostId}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(commentBody);

    expect(createCommentResponse.statusCode).toEqual(400);

    expect(createCommentResponse.body).toEqual({
      errorsMessages: [
        {
          message: "Длина должан быть от 20 до 300",
          field: "content",
        },
      ],
    });
  });

  it("should return 401 while creating comment for post with empty Authorization", async () => {
    const commentBody = {
      content: "s".repeat(21),
    };

    await request(app)
      .post(`/posts/${createdPostId}/comments`)
      .send(commentBody)
      .expect(401);
  });

  it("should return 401 while creating comment for post with not valid access token", async () => {
    const commentBody = {
      content: "s".repeat(21),
    };

    await request(app)
      .post(`/posts/${createdPostId}/comments`)
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNmE5M2I5OWJmYmE2YWQwOTZhMWMxZGY1IiwiaWF0IjoxNzg4MDY2MjA1LCJleHAiOjE3ODgwNjY1MDV9.IXnt7jk11EwfV8CBcYwbUZnjbX99Q8zI5RvPbquHsNU`,
      )
      .send(commentBody)
      .expect(401);
  });

  it("should return 401 while creating comment for post with not valid access token", async () => {
    const commentBody = {
      content: "s".repeat(21),
    };

    await request(app)
      .post(`/posts/66d1f5a8c3e7429b8f1a6d30/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(commentBody)
      .expect(404);
  });
});
