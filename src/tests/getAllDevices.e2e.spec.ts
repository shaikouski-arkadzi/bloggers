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
let accessToken: string;
let refreshCookie: string;
let firstSession: JwtPayload | null;

const createUserBody = {
  login: "login",
  password: "password",
  email: "example@example.dev",
};

describe("GET /security/devices", () => {
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

    const setCookie = loginUserResponse.headers["set-cookie"];

    const cookies = Array.isArray(setCookie)
      ? setCookie
      : setCookie
        ? [setCookie]
        : [];

    refreshCookie = cookies.find((cookie: string) =>
      cookie.startsWith("refreshToken="),
    );

    const refreshToken = refreshCookie
      ?.split(";")[0]
      .split("=")
      .slice(1)
      .join("=");

    firstSession = await jwtService.verifyToken(
      refreshToken,
      TokenType.Refresh,
    );

    expect(firstSession).toEqual(
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

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }, 100000);

  afterAll(async () => {
    await db.disconnect();
  });

  it("should successfully get device from login", async () => {
    const getAllDevicesResponse = await request(app)
      .get("/security/devices")
      .set("Cookie", refreshCookie)
      .expect(200);

    const devices: DeviceViewModel[] = getAllDevicesResponse.body;

    expect(devices.length === 1);

    expect(devices[0].deviceId === firstSession?.deviceId);
    expect(devices[0].title === firstSession?.deviceName);
    expect(devices[0].ip === firstSession?.ip);
    expect(devices[0].lastActiveDate !== firstSession?.iat.toString());
  });

  it("should return 401 for an invalid refresh token", async () => {
    await request(app)
      .get("/security/devices")
      .set("Cookie", "refreshToken=invalid-token")
      .expect(401);
  });
});
