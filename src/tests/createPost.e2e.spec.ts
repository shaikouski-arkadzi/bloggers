import request, {Response} from "supertest";
import express from "express";
import { db } from "../db";
import blogsRoutes from "../blogs/routes";
import postsRoutes from "../posts/routes";
import { BLOGS_PATH } from "../blogs/constants";
import { POSTS_PATH } from "../posts/constants";

const app = express();

app.use(express.json());

app.use(BLOGS_PATH, blogsRoutes);
app.use(POSTS_PATH, postsRoutes);

let createBlogResponse: Response;

describe("POST /posts", () => {
  beforeAll(async () => {
    db.blogs.length = 0
    db.posts.length = 0

    const blogBody = {
      name: "string",
      description: "string",
      websiteUrl: "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYVik"
    };

    createBlogResponse = await request(app)
      .post(BLOGS_PATH)
      .send(blogBody)
      .expect(201);
  });

  it("should create post with valid data", async () => {
    const postBody = {
      title: "string",
      shortDescription: "string",
      content: "string",
      blogId: createBlogResponse.body.id
    }

    const createPostResponse = await request(app)
      .post(POSTS_PATH)
      .send(postBody)
      .expect(201);

    expect(createPostResponse.body).toEqual({
      id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
      title: "string",
      shortDescription: "string",
      content: "string",
      blogId: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
      blogName: "string"
    });

    expect(db.posts.length).toBe(1);
  });

  it("should return 400 if title is missing", async () => {
    const postBody = {
      shortDescription: "string",
      content: "string",
      blogId: createBlogResponse.body.id
    }

    const response = await request(app)
      .post(POSTS_PATH)
      .send(postBody);

    expect(response.statusCode).toEqual(400)

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле обязательное",
          field: "title",
        }
      ],
    });
  });

  it("should return 400 if title is not string", async () => {
    const postBody = {
      title: 1,
      shortDescription: "string",
      content: "string",
      blogId: createBlogResponse.body.id
    }

    const response = await request(app)
      .post(POSTS_PATH)
      .send(postBody);

    expect(response.statusCode).toEqual(400)

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле должно быть типом string",
          field: "title",
        },
      ],
    });
  });

  it("should return 400 if title longer than 30 chars", async () => {
    const postBody = {
      title: 'a'.repeat(31),
      shortDescription: "string",
      content: "string",
      blogId: createBlogResponse.body.id
    }
    
    const response = await request(app)
      .post(POSTS_PATH)
      .send(postBody)
      .expect(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Максимальная длина 30 символов",
          field: "title"
        },
      ],
    });
  });

  it("should return 400 if shortDescription is missing", async () => {
    const postBody = {
      title: "string",
      content: "string",
      blogId: createBlogResponse.body.id
    }

    const response = await request(app)
      .post(POSTS_PATH)
      .send(postBody);

    expect(response.statusCode).toEqual(400)

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле обязательное",
          field: "shortDescription",
        }
      ],
    });
  });

  it("should return 400 if shortDescription is not string", async () => {
    const postBody = {
      title: "string",
      shortDescription: 1,
      content: "string",
      blogId: createBlogResponse.body.id
    }

    const response = await request(app)
      .post(POSTS_PATH)
      .send(postBody);

    expect(response.statusCode).toEqual(400)

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле должно быть типом string",
          field: "shortDescription",
        },
      ],
    });
  });

  it("should return 400 if shortDescription longer than 100 chars", async () => {
    const postBody = {
      title: "string",
      shortDescription: 'a'.repeat(101),
      content: "string",
      blogId: createBlogResponse.body.id
    }
    
    const response = await request(app)
      .post(POSTS_PATH)
      .send(postBody)
      .expect(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Максимальная длина 100 символов",
          field: "shortDescription"
        },
      ],
    });
  });

  it("should return 400 if content is missing", async () => {
    const postBody = {
      title: "string",
      shortDescription: "string",
      blogId: createBlogResponse.body.id
    }

    const response = await request(app)
      .post(POSTS_PATH)
      .send(postBody);

    expect(response.statusCode).toEqual(400)

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле обязательное",
          field: "content",
        }
      ],
    });
  });

  it("should return 400 if content is not string", async () => {
    const postBody = {
      title: "string",
      shortDescription: "string",
      content: 1,
      blogId: createBlogResponse.body.id
    }

    const response = await request(app)
      .post(POSTS_PATH)
      .send(postBody);

    expect(response.statusCode).toEqual(400)

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле должно быть типом string",
          field: "content",
        },
      ],
    });
  });

  it("should return 400 if content longer than 1000 chars", async () => {
    const postBody = {
      title: "string",
      shortDescription: "string",
      content: 'a'.repeat(1001),
      blogId: createBlogResponse.body.id
    }
    
    const response = await request(app)
      .post(POSTS_PATH)
      .send(postBody)
      .expect(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Максимальная длина 1000 символов",
          field: "content"
        },
      ],
    });
  });

  it("should return 400 if blogId is missing", async () => {
    const postBody = {
      title: "string",
      shortDescription: "string",
      content: "string"
    }

    const response = await request(app)
      .post(POSTS_PATH)
      .send(postBody);

    expect(response.statusCode).toEqual(400)

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле обязательное",
          field: "blogId",
        }
      ],
    });
  });

  it("should return 400 if blogId is not string", async () => {
    const postBody = {
      title: "string",
      shortDescription: "string",
      content: "string",
      blogId: 1
    }

    const response = await request(app)
      .post(POSTS_PATH)
      .send(postBody);

    expect(response.statusCode).toEqual(400)

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Поле должно быть типом string",
          field: "blogId",
        },
      ],
    });
  });

  it("should return 400 if blog not exists by id", async () => {
    const postBody = {
      title: "string",
      shortDescription: "string",
      content: "string",
      blogId: "test"
    }
    
    const response = await request(app)
      .post(POSTS_PATH)
      .send(postBody)
      .expect(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Не найдено блога с таким идентификатором",
          field: "blogId",
        },
      ],
    });
  });
});