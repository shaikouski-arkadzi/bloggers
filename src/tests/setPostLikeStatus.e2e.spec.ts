import request from "supertest";
import express from "express";
import { ADMIN_LOGIN, ADMIN_PASSWORD } from "../settings/config";
import { setupApp } from "../setup-app";
import { db } from "../db";
import { LikeInputModel } from "../common/types";
import { Post } from "../posts/types";

const app = express();

setupApp(app);

describe("PUT /posts/:id/like-status", () => {
  let accessToken: string;
  let createdUserId: string;
  let createdPostId: string;

  const userLogin = "login";
  const blogBody = {
    name: "string",
    description: "string",
    websiteUrl:
      "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYVik",
  };
  const postBody = {
    title: "string",
    shortDescription: "string",
    content: "string",
    blogId: "",
  };

  const ADMIN_LOGIN_PASSWORD = `${ADMIN_LOGIN}:${ADMIN_PASSWORD}`;
  const ADMIN_TOKEN = Buffer.from(ADMIN_LOGIN_PASSWORD, "utf-8").toString(
    "base64",
  );

  beforeAll(async () => {
    await db.connect();

    await request(app).delete("/testing/all-data").expect(204);

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

    const createBlogResponse = await request(app)
      .post("/blogs")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(blogBody)
      .expect(201);

    postBody.blogId = createBlogResponse.body.id;

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

  it("should return 200 and post by id with Like", async () => {
    const likeStatusBody: LikeInputModel = {
      likeStatus: "Like",
    };

    await request(app)
      .put(`/posts/${createdPostId}/like-status`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(likeStatusBody)
      .expect(204);

    const response = await request(app)
      .get(`/posts/${createdPostId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toEqual<Post>({
      id: createdPostId,
      title: postBody.title,
      shortDescription: postBody.shortDescription,
      content: postBody.content,
      blogId: postBody.blogId,
      blogName: blogBody.name,
      createdAt: expect.stringMatching(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      ),
      extendedLikesInfo: {
        likesCount: 1,
        dislikesCount: 0,
        myStatus: "Like",
      },
    });
  });

  it("should return 200 and post by id with DisLike", async () => {
    const likeStatusBody: LikeInputModel = {
      likeStatus: "Dislike",
    };

    await request(app)
      .put(`/posts/${createdPostId}/like-status`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(likeStatusBody)
      .expect(204);

    const response = await request(app)
      .get(`/posts/${createdPostId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toEqual<Post>({
      id: createdPostId,
      title: postBody.title,
      shortDescription: postBody.shortDescription,
      content: postBody.content,
      blogId: postBody.blogId,
      blogName: blogBody.name,
      createdAt: expect.stringMatching(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      ),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 1,
        myStatus: "Dislike",
      },
    });
  });

  it("should return 200 and comment by id with None likeStatus", async () => {
    const likeStatusBody: LikeInputModel = {
      likeStatus: "None",
    };

    await request(app)
      .put(`/posts/${createdPostId}/like-status`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(likeStatusBody)
      .expect(204);

    const response = await request(app)
      .get(`/posts/${createdPostId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toEqual<Post>({
      id: createdPostId,
      title: postBody.title,
      shortDescription: postBody.shortDescription,
      content: postBody.content,
      blogId: postBody.blogId,
      blogName: blogBody.name,
      createdAt: expect.stringMatching(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      ),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
      },
    });
  });

  it("should return 200 and post by id with 2 likeStatus", async () => {
    const secondCreateUserBody = {
      login: "user2",
      password: "password",
      email: "example2@example.dev",
    };

    await request(app)
      .post("/users")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(secondCreateUserBody)
      .expect(201);

    const loginSecondUserBody = {
      loginOrEmail: secondCreateUserBody.login,
      password: secondCreateUserBody.password,
    };

    const loginSecondUserResponse = await request(app)
      .post("/auth/login")
      .send(loginSecondUserBody)
      .expect(200);

    const accessToken2 = loginSecondUserResponse.body.accessToken;

    const likeStatusBody: LikeInputModel = {
      likeStatus: "Like",
    };

    await request(app)
      .put(`/posts/${createdPostId}/like-status`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(likeStatusBody)
      .expect(204);

    await request(app)
      .put(`/posts/${createdPostId}/like-status`)
      .set("Authorization", `Bearer ${accessToken2}`)
      .send(likeStatusBody)
      .expect(204);

    const response = await request(app)
      .get(`/posts/${createdPostId}`)
      .expect(200);

    expect(response.body).toEqual<Post>({
      id: createdPostId,
      title: postBody.title,
      shortDescription: postBody.shortDescription,
      content: postBody.content,
      blogId: postBody.blogId,
      blogName: blogBody.name,
      createdAt: expect.stringMatching(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      ),
      extendedLikesInfo: {
        likesCount: 2,
        dislikesCount: 0,
        myStatus: "None",
      },
    });
  }, 10000);

  it("should return 404 if id not exist", async () => {
    await request(app)
      .get(`/posts/66d1f5a8c3e7429b8f1a6d30/like-status`)
      .expect(404);
  });
});
