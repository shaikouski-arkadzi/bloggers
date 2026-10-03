import request from "supertest";
import express from "express";
import { setupApp } from "../setup-app";
import { db } from "../db";
import { userQueryRepository } from "../users/composition-root";
import { nodemailerService } from "../auth/application";
import { registerTemplateMail } from "../auth/utils";
import { resetReqRateLimit } from "../auth/middleware";
import { ADMIN_LOGIN, ADMIN_PASSWORD } from "../settings/config";

const app = express();

setupApp(app);

describe("POST /auth/password-recovery", () => {
  const userBody = {
    login: "login",
    password: "password",
    email: "example@example.dev",
  };

  beforeEach(() => {
    resetReqRateLimit();
  });

  beforeAll(async () => {
    await db.connect();

    await request(app).delete("/testing/all-data").expect(204);

    jest.spyOn(nodemailerService, "sendEmail").mockResolvedValue(true);

    const ADMIN_LOGIN_PASSWORD = `${ADMIN_LOGIN}:${ADMIN_PASSWORD}`;
    const ADMIN_TOKEN = Buffer.from(ADMIN_LOGIN_PASSWORD, "utf-8").toString(
      "base64",
    );

    await request(app)
      .post("/users")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(userBody)
      .expect(201);
  });

  afterAll(async () => {
    await db.disconnect();

    jest.restoreAllMocks();
  });

  it("should send email for password recovery", async () => {
    await request(app)
      .post("/auth/password-recovery")
      .send({ email: userBody.email })
      .expect(204);

    expect(nodemailerService.sendEmail).toHaveBeenCalledTimes(1);
  });

  it("should return 204 if email not exist", async () => {
    await request(app)
      .post("/auth/password-recovery")
      .send({ email: "example1@example.dev" })
      .expect(204);

    expect(nodemailerService.sendEmail).toHaveBeenCalledTimes(0);
  });

  it("should return 400 if email is missing", async () => {
    const body = {};

    const response = await request(app)
      .post("/auth/password-recovery")
      .send(body)
      .expect(400);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле обязательное",
          field: "email",
        },
      ],
    });
  });

  it("should return 400 if email is empty", async () => {
    const body = {
      email: " ",
    };

    const response = await request(app)
      .post("/auth/password-recovery")
      .send(body);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле не должно быть пустым",
          field: "email",
        },
      ],
    });
  });

  it("should return 400 if email is not string", async () => {
    const body = {
      email: 1,
    };

    const response = await request(app)
      .post("/auth/password-recovery")
      .send(body);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле должно быть типом string",
          field: "email",
        },
      ],
    });
  });

  it("should return 400 if email is invalid", async () => {
    const body = {
      email: "email@example",
    };

    const response = await request(app)
      .post("/auth/password-recovery")
      .send(body);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Некорректный email",
          field: "email",
        },
      ],
    });
  });
});
