import request from "supertest";
import express from "express";
import { setupApp } from "../setup-app";
import { db } from "../db";
import { userQueryRepository } from "../users/repositories";
import { nodemailerService } from "../auth/application";
import { registerTemplateMail } from "../auth/utils";

const app = express();

setupApp(app);

describe("POST /auth/registration", () => {
  beforeAll(async () => {
    await db.connect();

    await request(app).delete("/testing/all-data").expect(204);

    jest.spyOn(nodemailerService, "sendEmail").mockResolvedValue(true);
  });

  afterAll(async () => {
    await db.disconnect();

    jest.restoreAllMocks();
  });

  it("should register user with valid data", async () => {
    const body = {
      login: "login",
      password: "password",
      email: "example@example.dev",
    };

    await request(app).post("/auth/registration").send(body).expect(204);

    const allUsers = await userQueryRepository.find();
    expect(allUsers.length).toBe(1);

    expect(nodemailerService.sendEmail).toHaveBeenCalledTimes(1);

    expect(nodemailerService.sendEmail).toHaveBeenCalledWith(
      body.email,
      expect.any(String),
      registerTemplateMail,
    );
  });

  it("should return 400 if login is missing", async () => {
    const body = {
      password: "password",
      email: "example1@example.dev",
    };

    const response = await request(app).post("/auth/registration").send(body);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле обязательное",
          field: "login",
        },
      ],
    });
  });

  it("should return 400 if login is empty", async () => {
    const body = {
      login: " ",
      password: "password",
      email: "example1@example.dev",
    };

    const response = await request(app).post("/auth/registration").send(body);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле не должно быть пустым",
          field: "login",
        },
      ],
    });
  });

  it("should return 400 if login is not string", async () => {
    const body = {
      login: 1,
      password: "password",
      email: "example1@example.dev",
    };

    const response = await request(app).post("/auth/registration").send(body);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле должно быть типом string",
          field: "login",
        },
      ],
    });
  });

  it("should return 400 if login is invalid", async () => {
    const body = {
      login: "login#",
      password: "password",
      email: "example1@example.dev",
    };

    const response = await request(app).post("/auth/registration").send(body);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message:
            "Строка может содержать только латинские буквы, цифры, символы '_' и '-'.",
          field: "login",
        },
      ],
    });
  });

  it("should return 400 if login longer than 10 chars", async () => {
    const response = await request(app)
      .post("/auth/registration")
      .send({
        login: "a".repeat(11),
        password: "password",
        email: "example1@example.dev",
      })
      .expect(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Длина 3-10 символов",
          field: "login",
        },
      ],
    });
  });

  it("should return 400 if login less than 3 chars", async () => {
    const response = await request(app)
      .post("/auth/registration")
      .send({
        login: "a".repeat(2),
        password: "password",
        email: "example1@example.dev",
      })
      .expect(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Длина 3-10 символов",
          field: "login",
        },
      ],
    });
  });

  it("should return 400 if password is missing", async () => {
    const body = {
      login: "login1",
      email: "example1@example.dev",
    };

    const response = await request(app).post("/auth/registration").send(body);

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
      login: "login1",
      password: " ",
      email: "example1@example.dev",
    };

    const response = await request(app).post("/auth/registration").send(body);

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
      login: "login1",
      password: 1,
      email: "example1@example.dev",
    };

    const response = await request(app).post("/auth/registration").send(body);

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

  it("should return 400 if password longer than 20 chars", async () => {
    const response = await request(app)
      .post("/auth/registration")
      .send({
        login: "login1",
        password: "a".repeat(21),
        email: "example1@example.dev",
      })
      .expect(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Длина 6-20 символов",
          field: "password",
        },
      ],
    });
  });

  it("should return 400 if password less than 6 chars", async () => {
    const response = await request(app)
      .post("/auth/registration")
      .send({
        login: "login1",
        password: "a".repeat(5),
        email: "example1@example.dev",
      })
      .expect(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Длина 6-20 символов",
          field: "password",
        },
      ],
    });
  });

  it("should return 400 if email is missing", async () => {
    const body = {
      login: "login1",
      password: "password",
    };

    const response = await request(app).post("/auth/registration").send(body);

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
      login: "login1",
      password: "password",
      email: " ",
    };

    const response = await request(app).post("/auth/registration").send(body);

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
      login: "login1",
      password: "password",
      email: 1,
    };

    const response = await request(app).post("/auth/registration").send(body);

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
      login: "login1",
      password: "password",
      email: "email@example",
    };

    const response = await request(app).post("/auth/registration").send(body);

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
