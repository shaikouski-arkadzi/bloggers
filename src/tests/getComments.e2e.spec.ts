import request from "supertest";
import express from "express";
import { ADMIN_LOGIN, ADMIN_PASSWORD } from "../settings/config";
import { setupApp } from "../setup-app";
import { db } from "../db";
import { Post } from "../posts/types";
import { SortBy, SortDirections } from "../common/types";
import {
  PAGE_DAFAULT,
  PAGE_SIZE_DAFAULT,
  SORT_DIRECTION_DAFAULT,
} from "../common/constants";
import { commentsQueryRepository } from "../comments/repositories";
import { ObjectId } from "mongodb";
import { Comment } from "../comments/types";

const app = express();

setupApp(app);

describe("GET /posts/:postId/comments", () => {
  let responseCreateData: Post[] = [];
  let commentsCount: number;

  let accessToken: string;
  let createdUserId: string;
  let createdPostId: string;

  const userLogin = "login";

  beforeAll(async () => {
    await db.connect();

    await request(app).delete("/testing/all-data").expect(204);

    const ADMIN_LOGIN_PASSWORD = `${ADMIN_LOGIN}:${ADMIN_PASSWORD}`;
    const ADMIN_TOKEN = Buffer.from(ADMIN_LOGIN_PASSWORD, "utf-8").toString(
      "base64",
    );

    const createUserBody = {
      login: userLogin,
      password: "password",
      email: "example@example.dev",
    };

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

    const blogBody = {
      name: "string",
      description: "string",
      websiteUrl:
        "https://Bm1JGOWTQKCIPnNlT1t3guQwwleVwaU7mIVVo9WE6b-oMo3YROCnasIz2cEtnT.bAxypoZ1iQXXOsO1H0E40QYOCYVik",
    };

    const createBlogResponse = await request(app)
      .post("/blogs")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(blogBody)
      .expect(201);

    const postBody = {
      title: "string",
      shortDescription: "string",
      content: "string",
      blogId: createBlogResponse.body.id,
    };

    const createPostResponse = await request(app)
      .post("/posts")
      .set("Authorization", `Basic ${ADMIN_TOKEN}`)
      .send(postBody)
      .expect(201);

    createdPostId = createPostResponse.body.id;

    for (let i = 0; i < 21; i++) {
      const commentBody = {
        content: `stringstringstringstring${i}`,
      };

      const createCommentResponse = await request(app)
        .post(`/posts/${createdPostId}/comments`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send(commentBody)
        .expect(201);

      responseCreateData.push(createCommentResponse.body);
    }

    responseCreateData.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    commentsCount = await commentsQueryRepository.count({
      postId: new ObjectId(createdPostId),
    });
  }, 100000);

  afterAll(async () => {
    await db.disconnect();
  });

  it("should return 200 and all post comments with default params queries", async () => {
    const response = await request(app)
      .get(`/posts/${createdPostId}/comments`)
      .expect(200);

    const page = PAGE_DAFAULT;
    const pageSize = PAGE_SIZE_DAFAULT;
    const pagesCount = Math.ceil(commentsCount / pageSize);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: commentsCount,
      items: responseCreateData.slice(startIndex, startIndex + pageSize),
    });

    const allComments = await commentsQueryRepository.findCommentsByPost(
      createdPostId,
      { page, pageSize },
    );
    expect(allComments.length).toBe(response.body.items.length);
  });

  it("should return 200 and all blog posts with setting pageNumber and default pageSize in params queries", async () => {
    const page = 2;

    const response = await request(app)
      .get(`/posts/${createdPostId}/comments?pageNumber=${page}`)
      .expect(200);

    const pageSize = PAGE_SIZE_DAFAULT;
    const pagesCount = Math.ceil(commentsCount / pageSize);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: commentsCount,
      items: responseCreateData.slice(startIndex, startIndex + pageSize),
    });

    const allComments = await commentsQueryRepository.findCommentsByPost(
      createdPostId,
      { page, pageSize },
    );
    expect(allComments.length).toBe(response.body.items.length);
  });

  it("should return 200 and all blog posts with setting pageSize and default pageNumber in params queries", async () => {
    const pageSize = 11;

    const response = await request(app)
      .get(`/posts/${createdPostId}/comments?pageSize=${pageSize}`)
      .expect(200);

    const page = PAGE_DAFAULT;
    const pagesCount = Math.ceil(commentsCount / pageSize);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: commentsCount,
      items: responseCreateData.slice(startIndex, startIndex + pageSize),
    });

    const allComments = await commentsQueryRepository.findCommentsByPost(
      createdPostId,
      { page, pageSize },
    );
    expect(allComments.length).toBe(response.body.items.length);
  });

  it("should return 200 and all blog posts with setting pageNumber and pageSize params queries", async () => {
    const page = 2;
    const pageSize = 11;

    const response = await request(app)
      .get(
        `/posts/${createdPostId}/comments?pageNumber=${page}&pageSize=${pageSize}`,
      )
      .expect(200);

    const pagesCount = Math.ceil(commentsCount / pageSize);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: commentsCount,
      items: responseCreateData.slice(startIndex, startIndex + pageSize),
    });

    const allComments = await commentsQueryRepository.findCommentsByPost(
      createdPostId,
      { page, pageSize },
    );
    expect(allComments.length).toBe(response.body.items.length);
  });

  it("should return 200 and all blog posts with setting asc order. Other fields default", async () => {
    const sortDirection = SortDirections.ASC;

    const response = await request(app)
      .get(`/posts/${createdPostId}/comments?sortDirection=${sortDirection}`)
      .expect(200);

    const sortBy: SortBy<Post> = "createdAt";

    const page = PAGE_DAFAULT;
    const pageSize = PAGE_SIZE_DAFAULT;
    const pagesCount = Math.ceil(commentsCount / pageSize);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: commentsCount,
      items: [...responseCreateData]
        .reverse()
        .slice(startIndex, startIndex + pageSize),
    });

    const allComments = await commentsQueryRepository.findCommentsByPost(
      createdPostId,
      {
        page,
        pageSize,
        sortBy,
        sortDirection,
      },
    );
    expect(allComments.length).toBe(response.body.items.length);
  });

  it("should return 200 and all blog posts with sorting by content. Other fields default", async () => {
    const sortBy: SortBy<Comment> = "content";

    const response = await request(app)
      .get(`/posts/${createdPostId}/comments?sortBy=${sortBy}`)
      .expect(200);

    const sortDirection = SORT_DIRECTION_DAFAULT;

    const page = PAGE_DAFAULT;
    const pageSize = PAGE_SIZE_DAFAULT;
    const pagesCount = Math.ceil(commentsCount / pageSize);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: commentsCount,
      items: responseCreateData
        .sort((a, b) => b.content.localeCompare(a.content))
        .slice(startIndex, startIndex + pageSize),
    });

    const allComments = await commentsQueryRepository.findCommentsByPost(
      createdPostId,
      {
        page,
        pageSize,
        sortBy,
        sortDirection,
      },
    );
    expect(allComments.length).toBe(response.body.items.length);
  });

  it("should return 400 with setting 0 pageNumber", async () => {
    const page = 0;

    const response = await request(app)
      .get(`/posts/${createdPostId}/comments?pageNumber=${page}`)
      .expect(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Номер страницы должен быть больше 0",
          field: "pageNumber",
        },
      ],
    });
  });

  it("should return 400 with setting 0 pageSize", async () => {
    const pageSize = 0;

    const response = await request(app)
      .get(`/posts/${createdPostId}/comments?pageSize=${pageSize}`)
      .expect(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Количество элементов на странице должно быть больше 0",
          field: "pageSize",
        },
      ],
    });
  });
});
