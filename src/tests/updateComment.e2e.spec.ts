import request from "supertest";
import express from "express";
import { ADMIN_LOGIN, ADMIN_PASSWORD } from "../settings/config";
import { setupApp } from "../setup-app";
import { db } from "../db";
import { Comment } from "../comments/types";

const app = express();

setupApp(app);

describe("DELETE /comments/:id", () => {
  let createdComment: Comment;

  let accessToken1: string;
  let accessToken2: string;
  let createdPostId: string;

  const userLogin1 = "login1";
  const userLogin2 = "login2";
  const commentBody = {
    content: "stringstringstringstring",
  };
  const updatedCommentBody = {
    content: "newnewnewnewnewnewnew",
  };

  beforeAll(async () => {
    await db.connect();

    await request(app).delete("/testing/all-data").expect(204);

    const ADMIN_LOGIN_PASSWORD = `${ADMIN_LOGIN}:${ADMIN_PASSWORD}`;
    const ADMIN_TOKEN = Buffer.from(ADMIN_LOGIN_PASSWORD, "utf-8").toString(
      "base64",
    );

    const createUserBody1 = {
      login: userLogin1,
      password: "password",
      email: "example1@example.dev",
    };

    await request(app)
      .post("/users")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(createUserBody1)
      .expect(201);

    const createUserBody2 = {
      login: userLogin2,
      password: "password",
      email: "example2@example.dev",
    };

    await request(app)
      .post("/users")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(createUserBody2)
      .expect(201);

    const loginUserBody1 = {
      loginOrEmail: createUserBody1.login,
      password: createUserBody1.password,
    };

    const loginUserResponse1 = await request(app)
      .post("/auth/login")
      .send(loginUserBody1)
      .expect(200);

    accessToken1 = loginUserResponse1.body.accessToken;

    const loginUserBody2 = {
      loginOrEmail: createUserBody2.login,
      password: createUserBody2.password,
    };

    const loginUserResponse2 = await request(app)
      .post("/auth/login")
      .send(loginUserBody2)
      .expect(200);

    accessToken2 = loginUserResponse2.body.accessToken;

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
      .set("Authorization", `Bearer ${accessToken1}`)
      .send(commentBody)
      .expect(201);

    createdComment = createCommentResponse.body;
  }, 100000);

  afterAll(async () => {
    await db.disconnect();
  });

  it("should return 204 and update comment by id", async () => {
    await request(app)
      .put(`/comments/${createdComment.id}`)
      .set("Authorization", `Bearer ${accessToken1}`)
      .send(updatedCommentBody)
      .expect(204);

    const updateCommentResponse = await request(app)
      .get(`/comments/${createdComment.id}`)
      .expect(200);

    expect(updateCommentResponse.body).toEqual({
      id: createdComment.id,
      content: updatedCommentBody.content,
      commentatorInfo: {
        userId: createdComment.commentatorInfo.userId,
        userLogin: createdComment.commentatorInfo.userLogin,
      },
      createdAt: createdComment.createdAt,
    });
  });

  it("should return 401 if Authorization header not set", async () => {
    await request(app)
      .put(`/comments/${createdComment.id}`)
      .send(updatedCommentBody)
      .expect(401);
  });

  it("should return 404 if comment not exist", async () => {
    await request(app)
      .put(`/comments/66d1f5a8c3e7429b8f1a6d30`)
      .set("Authorization", `Bearer ${accessToken1}`)
      .send(updatedCommentBody)
      .expect(404);
  });

  it("should return 403 if trying to update comment not owner", async () => {
    await request(app)
      .delete(`/comments/${createdComment.id}`)
      .set("Authorization", `Bearer ${accessToken2}`)
      .send(updatedCommentBody)
      .expect(403);
  });
});
