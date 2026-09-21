import request from "supertest";
import express from "express";
import { ADMIN_LOGIN, ADMIN_PASSWORD } from "../settings/config";
import { setupApp } from "../setup-app";
import { db } from "../db";
import { jwtService } from "../auth/application";
import { TokenType } from "../auth/application/jwt.service";

const app = express();

setupApp(app);

let createdUserId: string;

describe("POST /auth/login", () => {
  beforeAll(async () => {
    await db.connect();

    await request(app).delete("/testing/all-data").expect(204);

    const ADMIN_LOGIN_PASSWORD = `${ADMIN_LOGIN}:${ADMIN_PASSWORD}`;
    const ADMIN_TOKEN = Buffer.from(ADMIN_LOGIN_PASSWORD, "utf-8").toString(
      "base64",
    );

    const body = {
      login: "login",
      password: "password",
      email: "example@example.dev",
    };

    const response = await request(app)
      .post("/users")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(body)
      .expect(201);

    createdUserId = response.body.id;
  }, 100000);

  afterAll(async () => {
    await db.disconnect();
  });

  it("should successfully log in user by login", async () => {
    const body = {
      loginOrEmail: "login",
      password: "password",
    };

    const response = await request(app)
      .post("/auth/login")
      .send(body)
      .expect(200);

    expect(response.body).toEqual({
      accessToken: expect.any(String),
    });

    const setCookie = response.headers["set-cookie"];

    const cookies = Array.isArray(setCookie)
      ? setCookie
      : setCookie
        ? [setCookie]
        : [];

    const refreshCookie = cookies.find((cookie: string) =>
      cookie.startsWith("refreshToken="),
    );

    const refreshToken = refreshCookie
      ?.split(";")[0]
      .split("=")
      .slice(1)
      .join("=");

    const verified = await jwtService.verifyToken(
      refreshToken,
      TokenType.Refresh,
    );

    expect(verified).toEqual(
      expect.objectContaining({
        deviceId: expect.any(String),
        deviceName: expect.any(String),
        exp: expect.any(Number),
        iat: expect.any(Number),
        ip: expect.any(String),
        tokenType: TokenType.Refresh,
        uuid: createdUserId,
      }),
    );

    expect(refreshToken).toEqual(expect.any(String));
  });

  it("should successfully log in user by email", async () => {
    const body = {
      loginOrEmail: "example@example.dev",
      password: "password",
    };

    const response = await request(app)
      .post("/auth/login")
      .send(body)
      .expect(200);

    expect(response.body).toEqual({
      accessToken: expect.any(String),
    });

    const setCookie = response.headers["set-cookie"];

    const cookies = Array.isArray(setCookie)
      ? setCookie
      : setCookie
        ? [setCookie]
        : [];

    const refreshCookie = cookies.find((cookie: string) =>
      cookie.startsWith("refreshToken="),
    );

    expect(refreshCookie).toEqual(expect.any(String));
  });

  it("should return 400 if loginOrEmail is missing", async () => {
    const body = {
      password: "password",
    };

    const response = await request(app).post("/auth/login").send(body);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле обязательное",
          field: "loginOrEmail",
        },
      ],
    });
  });

  it("should return 400 if loginOrEmail is empty", async () => {
    const body = {
      loginOrEmail: " ",
      password: "password",
    };

    const response = await request(app).post("/auth/login").send(body);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле не должно быть пустым",
          field: "loginOrEmail",
        },
      ],
    });
  });

  it("should return 400 if password is missing", async () => {
    const body = {
      loginOrEmail: "login",
    };

    const response = await request(app).post("/auth/login").send(body);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле обязательное",
          field: "password",
        },
      ],
    });
  });

  it("should return 400 if password is empty", async () => {
    const body = {
      loginOrEmail: "login",
      password: " ",
    };

    const response = await request(app).post("/auth/login").send(body);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле не должно быть пустым",
          field: "password",
        },
      ],
    });
  });

  it("should return 400 if password is not string", async () => {
    const body = {
      loginOrEmail: "login",
      password: 1,
    };

    const response = await request(app).post("/auth/login").send(body);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле должно быть типом string",
          field: "password",
        },
      ],
    });
  });

  it("should not log in user by login and wrong password", async () => {
    const body = {
      loginOrEmail: "login",
      password: "passwordd",
    };

    await request(app).post("/auth/login").send(body).expect(401);
  });

  it("should not log in user by email and wrong password", async () => {
    const body = {
      loginOrEmail: "example@example.dev",
      password: "passwordd",
    };

    await request(app).post("/auth/login").send(body).expect(401);
  });

  it("should reject expired accessToken", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        loginOrEmail: "login",
        password: "password",
      })
      .expect(200);

    const { accessToken } = response.body;

    expect(accessToken).toEqual(expect.any(String));

    await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    // Ждём 11 секунд
    await new Promise((resolve) => setTimeout(resolve, 11_000));

    await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(401);
  }, 20_000);

  it("should reject expired refreshToken", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        loginOrEmail: "login",
        password: "password",
      })
      .expect(200);

    const setCookie = response.headers["set-cookie"];

    const cookies = Array.isArray(setCookie)
      ? setCookie
      : setCookie
        ? [setCookie]
        : [];

    const refreshCookie = cookies.find((cookie: string) =>
      cookie.startsWith("refreshToken="),
    );

    expect(refreshCookie).toEqual(expect.any(String));

    // Ждём 21 секунду
    await new Promise((resolve) => setTimeout(resolve, 21_000));

    await request(app)
      .post("/auth/refresh-token")
      .set("Cookie", refreshCookie)
      .expect(401);
  }, 25_000);
});
