import request, { Response } from "supertest";

import express from "express";
import { db } from "../db";
import blogsRoutes from "../blogs/routes";
import postsRoutes from "../posts/routes";
import { BLOGS_PATH } from "../blogs/constants";
import { POSTS_PATH } from "../posts/constants";
import { ADMIN_LOGIN, ADMIN_PASSWORD } from "../settings/config";

let ADMIN_LOGIN_PASSWORD: string;
let ADMIN_TOKEN: string;

const app = express();

app.use(express.json());

app.use(BLOGS_PATH, blogsRoutes);
app.use(POSTS_PATH, postsRoutes);

let createBlogResponse: Response;
let createPostResponse: Response;

describe("PUT /posts", () => {
  beforeAll(async () => {
    db.blogs.length = 0;
    db.posts.length = 0;

    ADMIN_LOGIN_PASSWORD = `${ADMIN_LOGIN}:${ADMIN_PASSWORD}`;
    ADMIN_TOKEN = Buffer.from(ADMIN_LOGIN_PASSWORD, "utf-8").toString("base64");

    const blogBody = {
      name: "string",
      description: "string",
      websiteUrl:
        "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYVik",
    };

    createBlogResponse = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(blogBody)
      .expect(201);

    const postBody = {
      title: "string",
      shortDescription: "string",
      content: "string",
      blogId: createBlogResponse.body.id,
    };

    createPostResponse = await request(app)
      .post(POSTS_PATH)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(postBody)
      .expect(201);

    expect(db.posts.length).toBe(1);
  });

  it("should update post with valid data", async () => {
    const postBody = {
      title: "stringNew",
      shortDescription: "stringNew",
      content: "stringNew",
      blogId: createBlogResponse.body.id,
    };

    await request(app)
      .put(`${POSTS_PATH}/${createPostResponse.body.id}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(postBody)
      .expect(204);

    expect(db.posts.length).toBe(1);
  });

  it("should return 404 if post not exists by id", async () => {
    const postBody = {
      title: "stringNew",
      shortDescription: "stringNew",
      content: "stringNew",
      blogId: "testNew",
    };

    await request(app)
      .put(`${POSTS_PATH}/testtest`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(postBody)
      .expect(404);
  });

  it("should return 400 if title is missing", async () => {
    const postBody = {
      shortDescription: "stringNew",
      content: "stringNew",
      blogId: createBlogResponse.body.id,
    };

    const response = await request(app)
      .put(`${POSTS_PATH}/${createPostResponse.body.id}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(postBody);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле обязательное",
          field: "title",
        },
      ],
    });
  });

  it("should return 400 if title is not string", async () => {
    const postBody = {
      title: 1,
      shortDescription: "stringNew",
      content: "stringNew",
      blogId: createBlogResponse.body.id,
    };

    const response = await request(app)
      .put(`${POSTS_PATH}/${createPostResponse.body.id}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(postBody);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле должно быть типом string",
          field: "title",
        },
      ],
    });
  });

  it("should return 400 if title longer than 30 chars", async () => {
    const postBody = {
      title: "a".repeat(31),
      shortDescription: "stringNew",
      content: "stringNew",
      blogId: createBlogResponse.body.id,
    };

    const response = await request(app)
      .put(`${POSTS_PATH}/${createPostResponse.body.id}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(postBody)
      .expect(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Максимальная длина 30 символов",
          field: "title",
        },
      ],
    });
  });

  it("should return 400 if shortDescription is missing", async () => {
    const postBody = {
      title: "stringNew",
      content: "stringNew",
      blogId: createBlogResponse.body.id,
    };

    const response = await request(app)
      .put(`${POSTS_PATH}/${createPostResponse.body.id}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(postBody);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле обязательное",
          field: "shortDescription",
        },
      ],
    });
  });

  it("should return 400 if shortDescription is not string", async () => {
    const postBody = {
      title: "stringNew",
      shortDescription: 1,
      content: "stringNew",
      blogId: createBlogResponse.body.id,
    };

    const response = await request(app)
      .put(`${POSTS_PATH}/${createPostResponse.body.id}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(postBody);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле должно быть типом string",
          field: "shortDescription",
        },
      ],
    });
  });

  it("should return 400 if shortDescription longer than 100 chars", async () => {
    const postBody = {
      title: "stringNew",
      shortDescription: "a".repeat(101),
      content: "stringNew",
      blogId: createBlogResponse.body.id,
    };

    const response = await request(app)
      .put(`${POSTS_PATH}/${createPostResponse.body.id}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(postBody)
      .expect(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Максимальная длина 100 символов",
          field: "shortDescription",
        },
      ],
    });
  });

  it("should return 400 if content is missing", async () => {
    const postBody = {
      title: "stringNew",
      shortDescription: "stringNew",
      blogId: createBlogResponse.body.id,
    };

    const response = await request(app)
      .put(`${POSTS_PATH}/${createPostResponse.body.id}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(postBody);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле обязательное",
          field: "content",
        },
      ],
    });
  });

  it("should return 400 if content is not string", async () => {
    const postBody = {
      title: "stringNew",
      shortDescription: "stringNew",
      content: 1,
      blogId: createBlogResponse.body.id,
    };

    const response = await request(app)
      .put(`${POSTS_PATH}/${createPostResponse.body.id}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(postBody);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле должно быть типом string",
          field: "content",
        },
      ],
    });
  });

  it("should return 400 if content longer than 1000 chars", async () => {
    const postBody = {
      title: "stringNew",
      shortDescription: "stringNew",
      content: "a".repeat(1001),
      blogId: createBlogResponse.body.id,
    };

    const response = await request(app)
      .put(`${POSTS_PATH}/${createPostResponse.body.id}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(postBody)
      .expect(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Максимальная длина 1000 символов",
          field: "content",
        },
      ],
    });
  });

  it("should return 400 if blogId is missing", async () => {
    const postBody = {
      title: "stringNew",
      shortDescription: "stringNew",
      content: "stringNew",
    };

    const response = await request(app)
      .put(`${POSTS_PATH}/${createPostResponse.body.id}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(postBody);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле обязательное",
          field: "blogId",
        },
      ],
    });
  });

  it("should return 400 if blogId is not string", async () => {
    const postBody = {
      title: "stringNew",
      shortDescription: "stringNew",
      content: "stringNew",
      blogId: 1,
    };

    const response = await request(app)
      .put(`${POSTS_PATH}/${createPostResponse.body.id}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(postBody);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле должно быть типом string",
          field: "blogId",
        },
      ],
    });
  });

  it("should return 400 if blog not exists by id", async () => {
    const postBody = {
      title: "stringNew",
      shortDescription: "stringNew",
      content: "stringNew",
      blogId: "testNew",
    };

    const response = await request(app)
      .put(`${POSTS_PATH}/${createPostResponse.body.id}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(postBody)
      .expect(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Не найдено блога с таким идентификатором",
          field: "blogId",
        },
      ],
    });
  });
});
