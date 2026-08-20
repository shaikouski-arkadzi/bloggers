import request from "supertest";
import express from "express";
import { ADMIN_LOGIN, ADMIN_PASSWORD } from "../settings/config";
import { setupApp } from "../setup-app";
import { db } from "../db";

let ADMIN_LOGIN_PASSWORD: string;
let ADMIN_TOKEN: string;

const app = express();

setupApp(app);

describe("DELETE /users/:id", () => {
  beforeAll(async () => {
    await db.connect();

    await request(app).delete("/testing/all-data").expect(204);

    ADMIN_LOGIN_PASSWORD = `${ADMIN_LOGIN}:${ADMIN_PASSWORD}`;
    ADMIN_TOKEN = Buffer.from(ADMIN_LOGIN_PASSWORD, "utf-8").toString("base64");
  });

  afterAll(async () => {
    await db.disconnect();
  });

  it("should delete user by id", async () => {
    const body = {
      login: "login",
      password: "password",
      email: "example@example.dev"
    };

    const responseCreate = await request(app)
      .post("/users")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(body)
      .expect(201);

    await request(app)
      .delete(`/users/${responseCreate.body.id}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .expect(204);
  });

  it("should return 404 if blog does not exist", async () => {
    await request(app)
      .delete("/blogs/test")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .expect(404);
  });
});
