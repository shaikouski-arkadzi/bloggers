import request from "supertest";
import express from "express";
import { ADMIN_LOGIN, ADMIN_PASSWORD } from "../settings/config";
import { setupApp } from "../setup-app";
import { db } from "../db";
import { jwtService } from "../auth/application";
import { JwtRefreshPayload, TokenType } from "../auth/application/jwt.service";

const app = express();

setupApp(app);

let createdFirstUserId: string;
let createdSecondUserId: string;
let refreshFirstCookie: string;
let firstUserSession: JwtRefreshPayload | null;
let refreshSecondCookie: string;
let secondUserSession: JwtRefreshPayload | null;

const createFirstUserBody = {
  login: "login",
  password: "password",
  email: "example@example.dev",
};

const loginFirstUserBody = {
  loginOrEmail: createFirstUserBody.login,
  password: createFirstUserBody.password,
};

const createSecondUserBody = {
  login: "login2",
  password: "password",
  email: "example2@example.dev",
};

describe("DELETE /security/devices/:id", () => {
  beforeAll(async () => {
    await db.connect();

    await request(app).delete("/testing/all-data").expect(204);

    const ADMIN_LOGIN_PASSWORD = `${ADMIN_LOGIN}:${ADMIN_PASSWORD}`;
    const ADMIN_TOKEN = Buffer.from(ADMIN_LOGIN_PASSWORD, "utf-8").toString(
      "base64",
    );

    const createFirstUserResponse = await request(app)
      .post("/users")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(createFirstUserBody)
      .expect(201);

    const createSecondUserResponse = await request(app)
      .post("/users")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(createSecondUserBody)
      .expect(201);

    createdFirstUserId = createFirstUserResponse.body.id;
    createdSecondUserId = createSecondUserResponse.body.id;

    const loginSecondUserBody = {
      loginOrEmail: createSecondUserBody.login,
      password: createSecondUserBody.password,
    };

    const loginFirstUserResponse = await request(app)
      .post("/auth/login")
      .send(loginFirstUserBody)
      .expect(200);

    const loginSecondUserResponse = await request(app)
      .post("/auth/login")
      .send(loginSecondUserBody)
      .expect(200);

    let setCookie = loginFirstUserResponse.headers["set-cookie"];

    let cookies = Array.isArray(setCookie)
      ? setCookie
      : setCookie
        ? [setCookie]
        : [];

    refreshFirstCookie = cookies.find((cookie: string) =>
      cookie.startsWith("refreshToken="),
    );

    setCookie = loginSecondUserResponse.headers["set-cookie"];

    cookies = Array.isArray(setCookie)
      ? setCookie
      : setCookie
        ? [setCookie]
        : [];

    refreshSecondCookie = cookies.find((cookie: string) =>
      cookie.startsWith("refreshToken="),
    );

    let refreshToken = refreshFirstCookie
      ?.split(";")[0]
      .split("=")
      .slice(1)
      .join("=");

    firstUserSession = await jwtService.verifyToken(
      refreshToken,
      TokenType.Refresh,
    );

    expect(firstUserSession).toEqual(
      expect.objectContaining({
        deviceId: expect.any(String),
        deviceName: expect.any(String),
        exp: expect.any(Number),
        iat: expect.any(Number),
        ip: expect.any(String),
        tokenType: TokenType.Refresh,
        uuid: createdFirstUserId,
      }),
    );

    refreshToken = refreshSecondCookie
      ?.split(";")[0]
      .split("=")
      .slice(1)
      .join("=");

    secondUserSession = await jwtService.verifyToken(
      refreshToken,
      TokenType.Refresh,
    );

    expect(secondUserSession).toEqual(
      expect.objectContaining({
        deviceId: expect.any(String),
        deviceName: expect.any(String),
        exp: expect.any(Number),
        iat: expect.any(Number),
        ip: expect.any(String),
        tokenType: TokenType.Refresh,
        uuid: createdSecondUserId,
      }),
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }, 100000);

  afterAll(async () => {
    await db.disconnect();
  });

  it("should successfully delete device from login", async () => {
    await request(app)
      .delete(`/security/devices/${firstUserSession?.deviceId}`)
      .set("Cookie", refreshFirstCookie)
      .expect(204);
  });

  it("logout on previous step", async () => {});

  it("get Unauthorized error", async () => {
    await request(app)
      .delete(`/security/devices/${firstUserSession?.deviceId}`)
      .set("Cookie", refreshFirstCookie)
      .expect(401);
  });

  it("again login as first user", async () => {
    const loginFirstUserResponse = await request(app)
      .post("/auth/login")
      .send(loginFirstUserBody)
      .expect(200);

    let setCookie = loginFirstUserResponse.headers["set-cookie"];

    let cookies = Array.isArray(setCookie)
      ? setCookie
      : setCookie
        ? [setCookie]
        : [];

    refreshFirstCookie = cookies.find((cookie: string) =>
      cookie.startsWith("refreshToken="),
    );
  });

  it("attempting to delete another user's device", async () => {
    await request(app)
      .delete(`/security/devices/${secondUserSession?.deviceId}`)
      .set("Cookie", refreshFirstCookie)
      .expect(403);
  });
});
