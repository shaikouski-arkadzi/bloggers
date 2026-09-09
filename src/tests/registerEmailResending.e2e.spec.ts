import request from "supertest";
import express from "express";
import { setupApp } from "../setup-app";
import { db } from "../db";
import { userQueryRepository } from "../users/repositories";

const app = express();

setupApp(app);

describe("POST /auth/registration-email-resending", () => {
  beforeAll(async () => {
    await db.connect();

    await request(app).delete("/testing/all-data").expect(204);
  });

  afterAll(async () => {
    await db.disconnect();
  });

  it("should resend email for register user with valid data", async () => {
    const userBody = {
      login: "login",
      password: "password",
      email: "example@example.dev"
    };

    await request(app)
      .post("/auth/registration")
      .send(userBody)
      .expect(204);

    const allUsers = await userQueryRepository.find();
    expect(allUsers.length).toBe(1);

    const body = {
      email: "example@example.dev"
    };

    await request(app)
      .post("/auth/registration-email-resending")
      .send(body)
      .expect(204);
  });

  it("should return 400 if email is missing", async () => {
    const body = {};

    const response = await request(app)
      .post("/auth/registration-email-resending")
      .send(body);

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
      .post("/auth/registration-email-resending")
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
      .post("/auth/registration-email-resending")
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
      .post("/auth/registration-email-resending")
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
