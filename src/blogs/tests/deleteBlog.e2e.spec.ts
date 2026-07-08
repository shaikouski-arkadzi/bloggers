import request from "supertest";
import express from "express";
import router from "../routes";
import { db } from "../../db";

const app = express();

app.use(express.json());
app.use("/blogs", router);

describe("DELETE /blogs/:id", () => {
  beforeAll(() => {
    db.blogs.length = 0
    db.posts.length = 0
  });

  it("should delete blog by id", async () => {
    const body = {
      name: "string",
      description: "string",
      websiteUrl: "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYVik"
    };

    const responseCreate = await request(app)
      .post("/blogs")
      .send(body)
      .expect(201);

    await request(app)
      .delete(`/blogs/${responseCreate.body.id}`)
      .expect(204);
  });

  it("should return 404 if blog does not exist", async () => {
    await request(app).get("/blogs/test").expect(404);
  });
});