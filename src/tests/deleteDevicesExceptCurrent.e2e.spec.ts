import request from "supertest";
import express from "express";
import { ADMIN_LOGIN, ADMIN_PASSWORD } from "../settings/config";
import { setupApp } from "../setup-app";
import { db } from "../db";
import { jwtService } from "../auth/application";
import { JwtPayload, TokenType } from "../auth/application/jwt.service";
import { DeviceViewModel } from "../security/types";

const app = express();

setupApp(app);

let createdUserId: string;
let firstRefreshCookie: string;
let secondRefreshCookie: string;
let firstUserSession: JwtPayload | null;
let secondUserSession: JwtPayload | null;

const createUserBody = {
  login: "login",
  password: "password",
  email: "example@example.dev",
};

const loginUserBody = {
  loginOrEmail: createUserBody.login,
  password: createUserBody.password,
};

describe("DELETE /security/devices/:id", () => {
  beforeAll(async () => {
    await db.connect();

    await request(app).delete("/testing/all-data").expect(204);

    const ADMIN_LOGIN_PASSWORD = `${ADMIN_LOGIN}:${ADMIN_PASSWORD}`;
    const ADMIN_TOKEN = Buffer.from(ADMIN_LOGIN_PASSWORD, "utf-8").toString(
      "base64",
    );

    const firstCreateUserResponse = await request(app)
      .post("/users")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(createUserBody)
      .expect(201);

    createdUserId = firstCreateUserResponse.body.id;

    const loginFirstUserResponse = await request(app)
      .post("/auth/login")
      .send(loginUserBody)
      .expect(200);

    let setCookie = loginFirstUserResponse.headers["set-cookie"];

    let cookies = Array.isArray(setCookie)
      ? setCookie
      : setCookie
        ? [setCookie]
        : [];

    firstRefreshCookie = cookies.find((cookie: string) =>
      cookie.startsWith("refreshToken="),
    );

    let refreshToken = firstRefreshCookie
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
        uuid: createdUserId,
      }),
    );

    const loginSecondUserResponse = await request(app)
      .post("/auth/login")
      .send(loginUserBody)
      .expect(200);

    setCookie = loginSecondUserResponse.headers["set-cookie"];

    cookies = Array.isArray(setCookie)
      ? setCookie
      : setCookie
        ? [setCookie]
        : [];

    secondRefreshCookie = cookies.find((cookie: string) =>
      cookie.startsWith("refreshToken="),
    );

    refreshToken = secondRefreshCookie
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
        uuid: createdUserId,
      }),
    );

    const getAllDevicesResponse = await request(app)
      .get("/security/devices")
      .set("Cookie", firstRefreshCookie)
      .expect(200);

    const devices: DeviceViewModel[] = getAllDevicesResponse.body;

    expect(devices.length === 2);

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }, 100000);

  afterAll(async () => {
    await db.disconnect();
  });

  it("should successfully delete other session except current", async () => {
    await request(app)
      .delete(`/security/devices`)
      .set("Cookie", firstRefreshCookie)
      .expect(204);

    const getAllDevicesResponse = await request(app)
      .get("/security/devices")
      .set("Cookie", firstRefreshCookie)
      .expect(200);

    const devices: DeviceViewModel[] = getAllDevicesResponse.body;

    expect(devices.length === 1);

    expect(devices[0].deviceId === firstUserSession?.deviceId);
    expect(devices[0].title === firstUserSession?.deviceName);
    expect(devices[0].ip === firstUserSession?.ip);
    expect(devices[0].lastActiveDate !== firstUserSession?.iat.toString());
  });

  it("should return 401 for an invalid refresh token", async () => {
    await request(app)
      .delete(`/security/devices`)
      .set("Cookie", secondRefreshCookie)
      .expect(401);
  });
});
