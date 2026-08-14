import request, { Response } from "supertest";
import express from "express";
import { BLOGS_PATH } from "../blogs/constants";
import { POSTS_PATH } from "../posts/constants";
import { ADMIN_LOGIN, ADMIN_PASSWORD } from "../settings/config";
import { postRepository } from "../posts/repositories";
import { db } from "../db";
import { setupApp } from "../setup-app";

let ADMIN_LOGIN_PASSWORD: string;
let ADMIN_TOKEN: string;

const app = express();

setupApp(app);

let createdBlogId: Response;

describe("POST /blogs/:id/posts", () => {
  beforeAll(async () => {
    await db.connect();

    await request(app).delete("/testing/all-data").expect(204);

    ADMIN_LOGIN_PASSWORD = `${ADMIN_LOGIN}:${ADMIN_PASSWORD}`;
    ADMIN_TOKEN = Buffer.from(ADMIN_LOGIN_PASSWORD, "utf-8").toString("base64");

    const blogBody = {
      name: "string",
      description: "string",
      websiteUrl:
        "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYVik",
    };

    const createBlogResponse = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(blogBody)
      .expect(201);

    createdBlogId = createBlogResponse.body.id;
  });

  afterAll(async () => {
    await db.disconnect();
  });

  it("should create post with valid data", async () => {
    const postBody = {
      title: "string",
      shortDescription: "string",
      content: "string",
    };

    const createPostResponse = await request(app)
      .post(`/blogs/${createdBlogId}/posts`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(postBody)
      .expect(201);

    expect(createPostResponse.body).toEqual({
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

    const allPosts = await postRepository.find();
    expect(allPosts.length).toBe(1);
  });

  it("should return 400 if title is missing", async () => {
    const postBody = {
      shortDescription: "string",
      content: "string",
    };

    const response = await request(app)
      .post(`/blogs/${createdBlogId}/posts`)
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

  it("should return 400 if title is empty", async () => {
    const postBody = {
      title: " ",
      shortDescription: "string",
      content: "string",
    };

    const response = await request(app)
      .post(`/blogs/${createdBlogId}/posts`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(postBody);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле не должно быть пустым",
          field: "title",
        },
      ],
    });
  });

  it("should return 400 if title is not string", async () => {
    const postBody = {
      title: 1,
      shortDescription: "string",
      content: "string",
    };

    const response = await request(app)
      .post(`/blogs/${createdBlogId}/posts`)
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
      shortDescription: "string",
      content: "string",
    };

    const response = await request(app)
      .post(`/blogs/${createdBlogId}/posts`)
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
      title: "string",
      content: "string",
    };

    const response = await request(app)
      .post(`/blogs/${createdBlogId}/posts`)
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

  it("should return 400 if shortDescription is empty", async () => {
    const postBody = {
      title: "string",
      shortDescription: " ",
      content: "string",
    };

    const response = await request(app)
      .post(`/blogs/${createdBlogId}/posts`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(postBody);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле не должно быть пустым",
          field: "shortDescription",
        },
      ],
    });
  });

  it("should return 400 if shortDescription is not string", async () => {
    const postBody = {
      title: "string",
      shortDescription: 1,
      content: "string",
    };

    const response = await request(app)
      .post(`/blogs/${createdBlogId}/posts`)
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
      title: "string",
      shortDescription: "a".repeat(101),
      content: "string",
    };

    const response = await request(app)
      .post(`/blogs/${createdBlogId}/posts`)
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
      title: "string",
      shortDescription: "string",
    };

    const response = await request(app)
      .post(`/blogs/${createdBlogId}/posts`)
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

  it("should return 400 if content is empty", async () => {
    const postBody = {
      title: "string",
      shortDescription: "string",
      content: " ",
    };

    const response = await request(app)
      .post(`/blogs/${createdBlogId}/posts`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(postBody);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле не должно быть пустым",
          field: "content",
        },
      ],
    });
  });

  it("should return 400 if content is not string", async () => {
    const postBody = {
      title: "string",
      shortDescription: "string",
      content: 1,
    };

    const response = await request(app)
      .post(`/blogs/${createdBlogId}/posts`)
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
      title: "string",
      shortDescription: "string",
      content: "a".repeat(1001),
    };

    const response = await request(app)
      .post(`/blogs/${createdBlogId}/posts`)
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

  it("should return 400 if blog not exists by id", async () => {
    const postBody = {
      title: "string",
      shortDescription: "string",
      content: "string",
    };

    await request(app)
      .post(`/blogs/6a63bff16de99509911f914c/posts`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(postBody)
      .expect(404);
  });
});
