import request from "supertest";
import express from "express";
import { blogRepository } from "../blogs/repositories";
import { setupApp } from "../setup-app";
import { db } from "../db";
import { ADMIN_LOGIN, ADMIN_PASSWORD } from "../settings/config";
import { Blog } from "../blogs/types";
import { SortBy, SortDirections } from "../common/types";
import {
  PAGE_DAFAULT,
  PAGE_SIZE_DAFAULT,
  SORT_DIRECTION_DAFAULT,
} from "../common/constants";

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

    for (let i = 0; i < 21; i++) {
      const responseCreate = await request(app)
        .post("/blogs")
        .set("Authorization", `Basic ${ADMIN_TOKEN}`)
        .send({
          name: `name ${i}`,
          description: `description ${i}`,
          websiteUrl:
            "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYVik",
        })
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

  it("should return 200 and all blogs with default params queries", async () => {
    const response = await request(app).get("/blogs").expect(200);

    const page = PAGE_DAFAULT;
    const pageSize = PAGE_SIZE_DAFAULT;
    const pagesCount = Math.ceil(blogsCount / PAGE_SIZE_DAFAULT);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: blogsCount,
      items: responseCreateData.slice(startIndex, startIndex + pageSize),
    });

    const allBlogs = await blogRepository.find({ page, pageSize });
    expect(allBlogs.length).toBe(response.body.items.length);
  });

  it("should return 200 and all blogs with setting pageNumber and default pageSize in params queries", async () => {
    const page = 2;

    const response = await request(app)
      .get(`/blogs?pageNumber=${page}`)
      .expect(200);

    const pageSize = PAGE_SIZE_DAFAULT;
    const pagesCount = Math.ceil(blogsCount / pageSize);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: blogsCount,
      items: responseCreateData.slice(startIndex, startIndex + pageSize),
    });

    const allBlogs = await blogRepository.find({ page, pageSize });
    expect(allBlogs.length).toBe(response.body.items.length);
  });

  it("should return 200 and all blogs with setting pageSize and default pageNumber in params queries", async () => {
    const pageSize = 11;
    const response = await request(app)
      .get(`/blogs?pageSize=${pageSize}`)
      .expect(200);

    const page = PAGE_DAFAULT;
    const pagesCount = Math.ceil(blogsCount / pageSize);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: blogsCount,
      items: responseCreateData.slice(startIndex, startIndex + pageSize),
    });

    const allBlogs = await blogRepository.find({ page, pageSize });
    expect(allBlogs.length).toBe(response.body.items.length);
  });

  it("should return 200 and all blogs with setting pageNumber and pageSize params queries", async () => {
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

    const allBlogs = await blogRepository.find({ page, pageSize });
    expect(allBlogs.length).toBe(response.body.items.length);
  });

  it("should return 200 and all blogs with setting asc order. Other fields default", async () => {
    const sortDirection = SortDirections.ASC;

    const response = await request(app)
      .get(`/blogs?sortDirection=${sortDirection}`)
      .expect(200);

    const sortBy: SortBy<Blog> = "createdAt";

    const page = PAGE_DAFAULT;
    const pageSize = PAGE_SIZE_DAFAULT;
    const pagesCount = Math.ceil(blogsCount / pageSize);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: blogsCount,
      items: [...responseCreateData]
        .reverse()
        .slice(startIndex, startIndex + pageSize),
    });

    const allBlogs = await blogRepository.find({
      page,
      pageSize,
      sortBy,
      sortDirection,
    });
    expect(allBlogs.length).toBe(response.body.items.length);
  });

  it("should return 200 and all blogs with sorting by name. Other fields default", async () => {
    const sortBy: SortBy<Blog> = "name";

    const response = await request(app)
      .get(`/blogs?sortBy=${sortBy}`)
      .expect(200);

    const sortDirection = SORT_DIRECTION_DAFAULT;

    const page = PAGE_DAFAULT;
    const pageSize = PAGE_SIZE_DAFAULT;
    const pagesCount = Math.ceil(blogsCount / pageSize);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: blogsCount,
      items: responseCreateData
        .sort((a, b) => b.name.localeCompare(a.name))
        .slice(startIndex, startIndex + pageSize),
    });

    const allBlogs = await blogRepository.find({
      page,
      pageSize,
      sortBy,
      sortDirection,
    });
    expect(allBlogs.length).toBe(response.body.items.length);
  });

  it("should return 200 and all blogs with name 'name 10'. Other fields default", async () => {
    const searchNameTerm: string = "name 10";

    const response = await request(app)
      .get(`/blogs?searchNameTerm=${searchNameTerm}`)
      .expect(200);

    const page = PAGE_DAFAULT;
    const pageSize = PAGE_SIZE_DAFAULT;

    blogsCount = await blogRepository.count({
      name: searchNameTerm,
    });

    const pagesCount = Math.ceil(blogsCount / pageSize);

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: blogsCount,
      items: [responseCreateData.find((el) => el.name === "name 10")],
    });

    expect(response.body.items.length).toBe(1);
  });
});
