import request from "supertest";
import express from "express";
import router from "../blogs/routes";
import { db } from "../db";
import { ADMIN_LOGIN, ADMIN_PASSWORD } from "../settings/config";

let ADMIN_LOGIN_PASSWORD: string;
let ADMIN_TOKEN: string;

const app = express();

app.use(express.json());
app.use("/blogs", router);

describe("DELETE /blogs/:id", () => {
  beforeAll(() => {
    db.blogs.length = 0;
    db.posts.length = 0;

    ADMIN_LOGIN_PASSWORD = `${ADMIN_LOGIN}:${ADMIN_PASSWORD}`;
    ADMIN_TOKEN = Buffer.from(ADMIN_LOGIN_PASSWORD, "utf-8").toString("base64");
  });

  it("should delete blog by id", async () => {
    const body = {
      name: "string",
      description: "string",
      websiteUrl:
        "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYVik",
    };

    const responseCreate = await request(app)
      .post("/blogs")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(body)
      .expect(201);

    await request(app)
      .delete(`/blogs/${responseCreate.body.id}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .expect(204);
  });

  it("should return 404 if blog does not exist", async () => {
    await request(app).get("/blogs/test").expect(404);
  });
});
