import request from "supertest";
import express from "express";
import { blogRepository } from "../blogs/repositories";
import { setupApp } from "../setup-app";
import { db } from "../db";

const app = express();

setupApp(app);

describe("GET /blogs", () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  it("should return 200 and all videos", async () => {
    const response = await request(app).get("/blogs").expect(200);

    const allBlogs = await blogRepository.findAll();
    expect(allBlogs.length).toBe(response.body.length);
  });
});
