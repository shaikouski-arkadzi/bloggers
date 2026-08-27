import request from "supertest";
import express from "express";
import { ADMIN_LOGIN, ADMIN_PASSWORD } from "../settings/config";
import { setupApp } from "../setup-app";
import { db } from "../db";

const app = express();

setupApp(app);

let createdUserId: string;
let accessToken: string;

const createUserBody = {
  login: "login",
  password: "password",
  email: "example@example.dev",
};

describe("GET /auth/me", () => {
  beforeAll(async () => {
    await db.connect();

    await request(app).delete("/testing/all-data").expect(204);

    const ADMIN_LOGIN_PASSWORD = `${ADMIN_LOGIN}:${ADMIN_PASSWORD}`;
    const ADMIN_TOKEN = Buffer.from(ADMIN_LOGIN_PASSWORD, "utf-8").toString(
      "base64",
    );

    const createUserResponse = await request(app)
      .post("/users")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(createUserBody)
      .expect(201);

    createdUserId = createUserResponse.body.id;

    const loginUserBody = {
      loginOrEmail: createUserBody.login,
      password: createUserBody.password,
    };

    const loginUserResponse = await request(app)
      .post("/auth/login")
      .send(loginUserBody)
      .expect(200);

    accessToken = loginUserResponse.body.accessToken;
  }, 100000);

  afterAll(async () => {
    await db.disconnect();
  });

  it("should successfully get info about user", async () => {
    const response = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toEqual({
      login: createUserBody.login,
      email: createUserBody.email,
      userId: createdUserId,
    });
  });
});
