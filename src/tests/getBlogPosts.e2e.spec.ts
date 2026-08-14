import request from "supertest";
import express from "express";
import { BLOGS_PATH } from "../blogs/constants";
import { POSTS_PATH } from "../posts/constants";
import { ADMIN_LOGIN, ADMIN_PASSWORD } from "../settings/config";
import { postRepository } from "../posts/repositories";
import { setupApp } from "../setup-app";
import { db } from "../db";
import { Post } from "../posts/types";
import { SortBy, SortDirections } from "../common/types";
import {
  PAGE_DAFAULT,
  PAGE_SIZE_DAFAULT,
  SORT_DIRECTION_DAFAULT,
} from "../common/constants";

let ADMIN_LOGIN_PASSWORD: string;
let ADMIN_TOKEN: string;

const app = express();

setupApp(app);

describe("GET /blogs/:id/posts", () => {
  let responseCreateData: Post[] = [];
  let postsCount: number;
  let blogId: string;

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

    blogId = createBlogResponse.body.id;

    for (let i = 0; i < 21; i++) {
      const postBody = {
        title: `name ${i}`,
        shortDescription: `shortDescription ${i}`,
        content: `content ${i}`,
        blogId: blogId,
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

  it("should return 200 and all blog posts with default params queries", async () => {
    const response = await request(app)
      .get(`/blogs/${blogId}/posts`)
      .expect(200);

    const page = PAGE_DAFAULT;
    const pageSize = PAGE_SIZE_DAFAULT;
    const pagesCount = Math.ceil(postsCount / pageSize);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: postsCount,
      items: responseCreateData.slice(startIndex, startIndex + pageSize),
    });

    const allPosts = await postRepository.find({ page, pageSize });
    expect(allPosts.length).toBe(response.body.items.length);
  });

  it("should return 200 and all blog posts with setting pageNumber and default pageSize in params queries", async () => {
    const page = 2;

    const response = await request(app)
      .get(`/blogs/${blogId}/posts?pageNumber=${page}`)
      .expect(200);

    const pageSize = PAGE_SIZE_DAFAULT;
    const pagesCount = Math.ceil(postsCount / pageSize);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: postsCount,
      items: responseCreateData.slice(startIndex, startIndex + pageSize),
    });

    const allBlogs = await postRepository.find({ page, pageSize });
    expect(allBlogs.length).toBe(response.body.items.length);
  });

  it("should return 200 and all blog posts with setting pageSize and default pageNumber in params queries", async () => {
    const pageSize = 11;
    const response = await request(app)
      .get(`/blogs/${blogId}/posts?pageSize=${pageSize}`)
      .expect(200);

    const page = PAGE_DAFAULT;
    const pagesCount = Math.ceil(postsCount / pageSize);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: postsCount,
      items: responseCreateData.slice(startIndex, startIndex + pageSize),
    });

    const allBlogs = await postRepository.find({ page, pageSize });
    expect(allBlogs.length).toBe(response.body.items.length);
  });

  it("should return 200 and all blog posts with setting pageNumber and pageSize params queries", async () => {
    const page = 2;
    const pageSize = 11;

    const response = await request(app)
      .get(`/blogs/${blogId}/posts?pageNumber=${page}&pageSize=${pageSize}`)
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

    const allBlogs = await postRepository.find({ page, pageSize });
    expect(allBlogs.length).toBe(response.body.items.length);
  });

  it("should return 200 and all blog posts with setting asc order. Other fields default", async () => {
    const sortDirection = SortDirections.ASC;

    const response = await request(app)
      .get(`/blogs/${blogId}/posts?sortDirection=${sortDirection}`)
      .expect(200);

    const sortBy: SortBy<Post> = "createdAt";

    const page = PAGE_DAFAULT;
    const pageSize = PAGE_SIZE_DAFAULT;
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

    const allBlogs = await postRepository.find({
      page,
      pageSize,
      sortBy,
      sortDirection,
    });
    expect(allBlogs.length).toBe(response.body.items.length);
  });

  it("should return 200 and all blog posts with sorting by name. Other fields default", async () => {
    const sortBy: SortBy<Post> = "title";

    const response = await request(app)
      .get(`/blogs/${blogId}/posts?sortBy=${sortBy}`)
      .expect(200);

    const sortDirection = SORT_DIRECTION_DAFAULT;

    const page = PAGE_DAFAULT;
    const pageSize = PAGE_SIZE_DAFAULT;
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

    const allBlogs = await postRepository.find({
      page,
      pageSize,
      sortBy,
      sortDirection,
    });
    expect(allBlogs.length).toBe(response.body.items.length);
  });
});
