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
  let responseCreateData: Blog;

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

    const responseCreate = await request(app)
      .post("/blogs")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(bodyCreate)
      .expect(201);

    responseCreateData = responseCreate.body;
  });

  afterAll(async () => {
    await db.disconnect();
  });

  it("should return 200 and all videos", async () => {
    const response = await request(app).get("/blogs").expect(200);

    expect(response.body).toEqual({
      pagesCount: 0,
      page: 0,
      pageSize: 0,
      totalCount: 0,
      items: [responseCreateData],
    });

    const allBlogs = await blogRepository.findAll();
    expect(allBlogs.length).toBe(response.body.items.length);
  });
});
