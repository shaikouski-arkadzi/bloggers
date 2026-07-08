import request from "supertest";
import express from "express";
import router from "../routes";
import { db } from "../../db";

const app = express();

app.use(express.json());
app.use("/blogs", router);

describe("PUT /blogs/:id", () => {
  beforeAll(() => {
    db.blogs.length = 0
    db.posts.length = 0
  });

  it("should update blog with valid data", async () => {
    const bodyCreate = {
      name: "string",
      description: "string",
      websiteUrl: "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYVik"
    };

    const responseCreate = await request(app)
      .post("/blogs")
      .send(bodyCreate)
      .expect(201);

    const bodyUpdate = {
      name: "stringstring",
      description: "string",
      websiteUrl: "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYVik"
    };

    await request(app)
      .put(`/blogs/${responseCreate.body.id}`)
      .send(bodyUpdate)
      .expect(204);

    expect(db.blogs.length).toBe(1);
  });

  it("should return 404 if pass wrong id", async () => {
    const bodyUpdate = {
      name: "stringstring",
      description: "string",
      websiteUrl: "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYVik"
    };

    await request(app)
      .put(`/blogs/test`)
      .send(bodyUpdate)
      .expect(404);
  });

  it("should return 400 if name is missing", async () => {
    const body = {
      description: "string",
      websiteUrl: "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYVik"
    };

    const response = await request(app)
      .post("/blogs")
      .send(body);

    expect(response.statusCode).toEqual(400)

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле обязательное",
          field: "name",
        }
      ],
    });
  });

  it("should return 400 if name is not string", async () => {
    const body = {
      name: 1,
      description: "string",
      websiteUrl: "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYVik"
    };

    const response = await request(app)
      .post("/blogs")
      .send(body);

    expect(response.statusCode).toEqual(400)

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле должно быть типом string",
          field: "name",
        },
      ],
    });
  });

  it("should return 400 if name longer than 15 chars", async () => {
    const response = await request(app)
      .post("/blogs")
      .send({
        name: 'a'.repeat(16),
        description: "string",
        websiteUrl: "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYVik"
      })
      .expect(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Максимальная длина 15 символов",
          field: "name"
        },
      ],
    });
  });

  it("should return 400 if description is missing", async () => {
    const body = {
      name: "string",
      websiteUrl: "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYVik"
    };

    const response = await request(app)
      .post("/blogs")
      .send(body);

    expect(response.statusCode).toEqual(400)

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле обязательное",
          field: "description",
        }
      ],
    });
  });

  it("should return 400 if description is not string", async () => {
    const body = {
      name: "string",
      description: 1,
      websiteUrl: "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYVik"
    };

    const response = await request(app)
      .post("/blogs")
      .send(body);

    expect(response.statusCode).toEqual(400)

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
    const response = await request(app)
      .post("/blogs")
      .send({
        name: "string",
        description: 'a'.repeat(501),
        websiteUrl: "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYVik"
      })
      .expect(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Максимальная длина 500 символов",
          field: "description"
        },
      ],
    });
  });

    it("should return 400 if websiteUrl is missing", async () => {
    const body = {
      name: "string",
      description: "string",
    };

    const response = await request(app)
      .post("/blogs")
      .send(body);

    expect(response.statusCode).toEqual(400)

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле обязательное",
          field: "websiteUrl",
        }
      ],
    });
  });

  it("should return 400 if websiteUrl is not string", async () => {
    const body = {
      name: "string",
      description: "string",
      websiteUrl: 1
    };

    const response = await request(app)
      .post("/blogs")
      .send(body);

    expect(response.statusCode).toEqual(400)

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле должно быть типом string",
          field: "websiteUrl",
        },
      ],
    });
  });

  it("should return 400 if websiteUrl longer than 500 chars", async () => {
    const response = await request(app)
      .post("/blogs")
      .send({
        name: "string",
        description: "string",
        websiteUrl: 'a'.repeat(101)
      })
      .expect(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Максимальная длина 100 символов",
          field: "websiteUrl"
        },
      ],
    });
  });

  it("should return 400 if websiteUrl has invalid format", async () => {
    const response = await request(app)
      .post("/blogs")
      .send({
        name: "string",
        description: "string",
        websiteUrl: "http://example.com",
      })
      .expect(400);

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