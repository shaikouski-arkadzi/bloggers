import request from "supertest";
import express from "express";
import router from "../blogs/routes";
import { db } from "../db";
import { ADMIN_LOGIN, ADMIN_PASSWORD } from "../settings/config";

let ADMIN_LOGIN_PASSWORD: string;
let ADMIN_TOKEN: string;

let idCreatedBlog: string;

const app = express();

app.use(express.json());
app.use("/blogs", router);

describe("PUT /blogs/:id", () => {
  beforeAll(async () => {
    db.blogs.length = 0;
    db.posts.length = 0;

    ADMIN_LOGIN_PASSWORD = `${ADMIN_LOGIN}:${ADMIN_PASSWORD}`;
    ADMIN_TOKEN = Buffer.from(ADMIN_LOGIN_PASSWORD, "utf-8").toString("base64");

    const bodyCreate = {
      name: "string",
      description: "string",
      websiteUrl:
        "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYVik",
    };

    const responseCreate = await request(app)
      .post("/blogs")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(bodyCreate)
      .expect(201);

    console.log("before");
    console.log(responseCreate.body.id);

    idCreatedBlog = responseCreate.body.id;
  });

  it("should update blog with valid data", async () => {
    const bodyUpdate = {
      name: "stringNew",
      description: "stringNew",
      websiteUrl:
        "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYNEW",
    };

    await request(app)
      .put(`/blogs/${idCreatedBlog}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(bodyUpdate)
      .expect(204);

    expect(db.blogs.length).toBe(1);
  });

  it("should return 404 if pass wrong id", async () => {
    const bodyUpdate = {
      name: "stringstring",
      description: "string",
      websiteUrl:
        "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYVik",
    };

    await request(app)
      .put(`/blogs/test`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(bodyUpdate)
      .expect(404);
  });

  it("should return 400 if name is missing", async () => {
    const body = {
      description: "stringNew",
      websiteUrl:
        "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYNEW",
    };

    const response = await request(app)
      .put(`/blogs/${idCreatedBlog}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(body);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле обязательное",
          field: "name",
        },
      ],
    });
  });

  it("should return 400 if name is not string", async () => {
    const body = {
      name: 1,
      description: "stringNew",
      websiteUrl:
        "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYNEW",
    };

    const response = await request(app)
      .put(`/blogs/${idCreatedBlog}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(body);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле должно быть типом string",
          field: "name",
        },
      ],
    });
  });

  it("should return 400 if name is empty", async () => {
    const body = {
      name: " ",
      description: "stringNew",
      websiteUrl:
        "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYNEW",
    };

    const response = await request(app)
      .put(`/blogs/${idCreatedBlog}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(body);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле не должно быть пустым",
          field: "name",
        },
      ],
    });
  });

  it("should return 400 if name longer than 15 chars", async () => {
    const body = {
      name: "a".repeat(16),
      description: "stringNew",
      websiteUrl:
        "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYNEW",
    };

    const response = await request(app)
      .put(`/blogs/${idCreatedBlog}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(body);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Максимальная длина 15 символов",
          field: "name",
        },
      ],
    });
  });

  it("should return 400 if description is missing", async () => {
    const body = {
      name: "stringNew",
      websiteUrl:
        "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYNEW",
    };

    const response = await request(app)
      .put(`/blogs/${idCreatedBlog}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(body);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле обязательное",
          field: "description",
        },
      ],
    });
  });

  it("should return 400 if description is empty", async () => {
    const body = {
      name: "stringNew",
      description: " ",
      websiteUrl:
        "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYNEW",
    };

    const response = await request(app)
      .put(`/blogs/${idCreatedBlog}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(body);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле не должно быть пустым",
          field: "description",
        },
      ],
    });
  });

  it("should return 400 if description is not string", async () => {
    const body = {
      name: "stringNEW",
      description: 1,
      websiteUrl:
        "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYNEW",
    };

    const response = await request(app)
      .put(`/blogs/${idCreatedBlog}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(body);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле должно быть типом string",
          field: "description",
        },
      ],
    });
  });

  it("should return 400 if description longer than 500 chars", async () => {
    const body = {
      name: "strnigNew",
      description: "a".repeat(501),
      websiteUrl:
        "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYNEW",
    };

    const response = await request(app)
      .put(`/blogs/${idCreatedBlog}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(body);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Максимальная длина 500 символов",
          field: "description",
        },
      ],
    });
  });

  it("should return 400 if websiteUrl is missing", async () => {
    const body = {
      name: "stringNEW",
      description: "stringNEW",
    };

    const response = await request(app)
      .put(`/blogs/${idCreatedBlog}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(body);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле обязательное",
          field: "websiteUrl",
        },
      ],
    });
  });

  it("should return 400 if websiteUrl is empty", async () => {
    const body = {
      name: "stringNew",
      description: "stringNew",
      websiteUrl: " ",
    };

    const response = await request(app)
      .put(`/blogs/${idCreatedBlog}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(body);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле не должно быть пустым",
          field: "websiteUrl",
        },
      ],
    });
  });

  it("should return 400 if websiteUrl is not string", async () => {
    const body = {
      name: "stringNew",
      description: "stringNew",
      websiteUrl: 1,
    };

    const response = await request(app)
      .put(`/blogs/${idCreatedBlog}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(body);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле должно быть типом string",
          field: "websiteUrl",
        },
      ],
    });
  });

  it("should return 400 if websiteUrl longer than 100 chars", async () => {
    const body = {
      name: "strnigNew",
      description: "strnigNew",
      websiteUrl: "a".repeat(101),
    };

    const response = await request(app)
      .put(`/blogs/${idCreatedBlog}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(body);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Максимальная длина 100 символов",
          field: "websiteUrl",
        },
      ],
    });
  });

  it("should return 400 if websiteUrl has invalid format", async () => {
    const body = {
      name: "strnigNew",
      description: "strnigNew",
      websiteUrl: "http://example.com",
    };

    const response = await request(app)
      .put(`/blogs/${idCreatedBlog}`)
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(body);

    expect(response.statusCode).toEqual(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Некорректный url",
          field: "websiteUrl",
        },
      ],
    });
  });
});
