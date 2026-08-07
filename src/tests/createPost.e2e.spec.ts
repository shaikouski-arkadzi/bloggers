import request from "supertest";
import express from "express";
import dns from "node:dns";
import { BLOGS_PATH } from "../blogs/constants";
import { POSTS_PATH } from "../posts/constants";
import { ADMIN_LOGIN, ADMIN_PASSWORD } from "../settings/config";
import { postRepository } from "../posts/repositories";
import { setupApp } from "../setup-app";
import { db } from "../db";
import { Post } from "../posts/types";
import { SortBy } from "../common/types";

let ADMIN_LOGIN_PASSWORD: string;
let ADMIN_TOKEN: string;

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

setupApp(app);

describe("GET /posts", () => {
  let responseCreateData: Post[] = [];
  let postsCount: number;

  beforeAll(async () => {
    await db.connect();

    await request(app).delete("/testing/all-data").expect(204);

    ADMIN_LOGIN_PASSWORD = `${ADMIN_LOGIN}:${ADMIN_PASSWORD}`;
    ADMIN_TOKEN = Buffer.from(ADMIN_LOGIN_PASSWORD, "utf-8").toString("base64");

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

    for (let i = 0; i < 21; i++) {
      const postBody = {
        title: `name ${i}`,
        shortDescription: `shortDescription ${i}`,
        content: `content ${i}`,
        blogId: createBlogResponse.body.id,
      };

      const responseCreate = await request(app)
        .post(POSTS_PATH)
        .set("Authorization", `Basic ${ADMIN_TOKEN}`)
        .send(postBody)
        .expect(201);

      responseCreateData.push(responseCreate.body);
    }

    responseCreateData.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    postsCount = await postRepository.count();
  }, 30000);

  afterAll(async () => {
    await db.disconnect();
  });

  it("should return 200 and all posts with default params queries", async () => {
    const response = await request(app).get("/posts").expect(200);

    const page = 1;
    const pageSize = 10;
    const pagesCount = Math.ceil(postsCount / pageSize);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: postsCount,
      items: responseCreateData.slice(startIndex, startIndex + pageSize),
    });

    const allPosts = await postRepository.find(page, pageSize);
    expect(allPosts.length).toBe(response.body.items.length);
  });

  it("should return 200 and all posts with setting pageNumber and default pageSize in params queries", async () => {
    const page = 2;

    const response = await request(app)
      .get(`/posts?pageNumber=${page}`)
      .expect(200);

    const pageSize = 10;
    const pagesCount = Math.ceil(postsCount / pageSize);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: postsCount,
      items: responseCreateData.slice(startIndex, startIndex + pageSize),
    });

    const allBlogs = await postRepository.find(page, pageSize);
    expect(allBlogs.length).toBe(response.body.items.length);
  });

  it("should return 200 and all posts with setting pageSize and default pageNumber in params queries", async () => {
    const pageSize = 11;
    const response = await request(app)
      .get(`/posts?pageSize=${pageSize}`)
      .expect(200);

    const page = 1;
    const pagesCount = Math.ceil(postsCount / pageSize);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: postsCount,
      items: responseCreateData.slice(startIndex, startIndex + pageSize),
    });

    const allBlogs = await postRepository.find(page, pageSize);
    expect(allBlogs.length).toBe(response.body.items.length);
  });

  it("should return 200 and all posts with setting pageNumber and pageSize params queries", async () => {
    const page = 2;
    const pageSize = 11;

    const response = await request(app)
      .get(`/posts?pageNumber=${page}&pageSize=${pageSize}`)
      .expect(200);

    const pagesCount = Math.ceil(postsCount / pageSize);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: postsCount,
      items: responseCreateData.slice(startIndex, startIndex + pageSize),
    });

    const allBlogs = await postRepository.find(page, pageSize);
    expect(allBlogs.length).toBe(response.body.items.length);
  });

  it("should return 200 and all posts with setting asc order. Other fields default", async () => {
    const sortDirection = "asc";

    const response = await request(app)
      .get(`/posts?sortDirection=${sortDirection}`)
      .expect(200);

    const sortBy: SortBy<Post> = "createdAt";

    const page = 1;
    const pageSize = 10;
    const pagesCount = Math.ceil(postsCount / pageSize);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: postsCount,
      items: [...responseCreateData]
        .reverse()
        .slice(startIndex, startIndex + pageSize),
    });

    const allBlogs = await postRepository.find(
      page,
      pageSize,
      sortBy,
      sortDirection,
    );
    expect(allBlogs.length).toBe(response.body.items.length);
  });

  it("should return 200 and all posts with sorting by name. Other fields default", async () => {
    const sortBy: SortBy<Post> = "title";

    const response = await request(app)
      .get(`/posts?sortBy=${sortBy}`)
      .expect(200);

    const sortDirection = "desc";

    const page = 1;
    const pageSize = 10;
    const pagesCount = Math.ceil(postsCount / pageSize);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: postsCount,
      items: responseCreateData
        .sort((a, b) => b.title.localeCompare(a.title))
        .slice(startIndex, startIndex + pageSize),
    });

    const allBlogs = await postRepository.find(
      page,
      pageSize,
      sortBy,
      sortDirection,
    );
    expect(allBlogs.length).toBe(response.body.items.length);
  });
});
