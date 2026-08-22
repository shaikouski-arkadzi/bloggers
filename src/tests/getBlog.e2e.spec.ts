import request from "supertest";
import express from "express";
import { ObjectId } from "mongodb";
import { ADMIN_LOGIN, ADMIN_PASSWORD } from "../settings/config";
import { setupApp } from "../setup-app";
import { db } from "../db";

let ADMIN_LOGIN_PASSWORD: string;
let ADMIN_TOKEN: string;

const app = express();

setupApp(app);

describe("GET /blogs/:id", () => {
  beforeAll(async () => {
    await db.connect();

    await request(app).delete("/testing/all-data").expect(204);

    ADMIN_LOGIN_PASSWORD = `${ADMIN_LOGIN}:${ADMIN_PASSWORD}`;
    ADMIN_TOKEN = Buffer.from(ADMIN_LOGIN_PASSWORD, "utf-8").toString("base64");
  });

  afterAll(async () => {
    await db.disconnect();
  });

  it("should return blog by id", async () => {
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

    const responseGetById = await request(app)
      .get(`/blogs/${responseCreate.body.id}`)
      .expect(200);

    expect(responseGetById.body).toEqual(responseCreate.body);
  });

  it("should return 404 if video does not exist", async () => {
    await request(app).get(`/blogs/${new ObjectId()}`).expect(404);
  });

  it("should return 400 if pass not correct id", async () => {
    const response = await request(app)
      .get(`/blogs/test`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .expect(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Некорректный ID",
          field: "id",
        },
      ],
    });
  });
});
