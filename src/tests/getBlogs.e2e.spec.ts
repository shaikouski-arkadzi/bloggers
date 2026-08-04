import request from "supertest";
import express from "express";
import { blogRepository } from "../blogs/repositories";
import { setupApp } from "../setup-app";
import { db } from "../db";
import { ADMIN_LOGIN, ADMIN_PASSWORD } from "../settings/config";
import { Blog } from "../blogs/types";

const app = express();

setupApp(app);

describe("GET /blogs", () => {
  let responseCreateData: Blog[] = [];
  let blogsCount: number;

  beforeAll(async () => {
    await db.connect();

    await request(app).delete("/testing/all-data").expect(204);

    const ADMIN_LOGIN_PASSWORD = `${ADMIN_LOGIN}:${ADMIN_PASSWORD}`;
    const ADMIN_TOKEN = Buffer.from(ADMIN_LOGIN_PASSWORD, "utf-8").toString(
      "base64",
    );

    const bodyCreate = {
      name: "string",
      description: "string",
      websiteUrl:
        "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYVik",
    };

    for (let i = 0; i < 21; i++) {
      const responseCreate = await request(app)
        .post("/blogs")
        .set("Authorization", `Basic ${ADMIN_TOKEN}`)
        .send(bodyCreate)
        .expect(201);

      responseCreateData.push(responseCreate.body);
    }

    responseCreateData.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    blogsCount = await blogRepository.count();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  it("should return 200 and all videos with default params queries", async () => {
    const response = await request(app).get("/blogs").expect(200);

    const page = 1;
    const pageSize = 10;
    const pagesCount = Math.ceil(blogsCount / pageSize);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: blogsCount,
      items: responseCreateData.slice(startIndex, startIndex + pageSize),
    });

    const allBlogs = await blogRepository.find(page, pageSize);
    expect(allBlogs.length).toBe(response.body.items.length);
  });

  it("should return 200 and all videos with setting pageNumber and default pageSize in params queries", async () => {
    const page = 2;

    const response = await request(app)
      .get(`/blogs?pageNumber=${page}`)
      .expect(200);

    const pageSize = 10;
    const pagesCount = Math.ceil(blogsCount / pageSize);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: blogsCount,
      items: responseCreateData.slice(startIndex, startIndex + pageSize),
    });

    const allBlogs = await blogRepository.find(page, pageSize);
    expect(allBlogs.length).toBe(response.body.items.length);
  });

  it("should return 200 and all videos with setting pageSize and default pageNumber in params queries", async () => {
    const pageSize = 11;
    const response = await request(app)
      .get(`/blogs?pageSize=${pageSize}`)
      .expect(200);

    const page = 1;
    const pagesCount = Math.ceil(blogsCount / pageSize);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: blogsCount,
      items: responseCreateData.slice(startIndex, startIndex + pageSize),
    });

    const allBlogs = await blogRepository.find(page, pageSize);
    expect(allBlogs.length).toBe(response.body.items.length);
  });

  it("should return 200 and all videos with setting pageNumber and pageSize params queries", async () => {
    const page = 2;
    const pageSize = 11;

    const response = await request(app)
      .get(`/blogs?pageNumber=${page}&pageSize=${pageSize}`)
      .expect(200);

    const pagesCount = Math.ceil(blogsCount / pageSize);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: blogsCount,
      items: responseCreateData.slice(startIndex, startIndex + pageSize),
    });

    const allBlogs = await blogRepository.find(page, pageSize);
    expect(allBlogs.length).toBe(response.body.items.length);
  });
});
