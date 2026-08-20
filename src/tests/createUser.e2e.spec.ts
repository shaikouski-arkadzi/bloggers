import request from "supertest";
import express from "express";
import { ADMIN_LOGIN, ADMIN_PASSWORD } from "../settings/config";
import { setupApp } from "../setup-app";
import { db } from "../db";
import { userQueryRepository } from "../users/repositories";

let ADMIN_LOGIN_PASSWORD: string;
let ADMIN_TOKEN: string;

const app = express();

setupApp(app);

describe("POST /users", () => {
  beforeAll(async () => {
    await db.connect();

    await request(app).delete("/testing/all-data").expect(204);

    ADMIN_LOGIN_PASSWORD = `${ADMIN_LOGIN}:${ADMIN_PASSWORD}`;
    ADMIN_TOKEN = Buffer.from(ADMIN_LOGIN_PASSWORD, "utf-8").toString("base64");
  });

  afterAll(async () => {
    await db.disconnect();
  });

  it("should create user with valid data", async () => {
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

    expect(response.body).toEqual({
      id: expect.stringMatching(/^[0-9a-fA-F]{24}$/),
      login: "login",
      email: "example@example.dev",
      createdAt: expect.stringMatching(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      ),
    });

    const allUsers = await userQueryRepository.find();
    expect(allUsers.length).toBe(1);
  });

  it("should return 400 if login is missing", async () => {
    const body = {
      password: "password",
      email: "example1@example.dev",
    };

    const response = await request(app)
      .post("/users")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(body);

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

    const response = await request(app)
      .post("/users")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(body);

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

    const response = await request(app)
      .post("/users")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(body);

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

    const response = await request(app)
      .post("/users")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(body);

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
      .post("/users")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
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
      .post("/users")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
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

    const response = await request(app)
      .post("/users")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(body);

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

    const response = await request(app)
      .post("/users")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(body);

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

    const response = await request(app)
      .post("/users")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(body);

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
      .post("/users")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
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
      .post("/users")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
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

    const response = await request(app)
      .post("/users")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
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
      login: "login1",
      password: "password",
      email: " ",
    };

    const response = await request(app)
      .post("/users")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
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
      login: "login1",
      password: "password",
      email: 1,
    };

    const response = await request(app)
      .post("/users")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
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
      login: "login1",
      password: "password",
      email: "email@example",
    };

    const response = await request(app)
      .post("/users")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
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
