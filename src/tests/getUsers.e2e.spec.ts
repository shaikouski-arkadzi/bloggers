import request from "supertest";
import express from "express";
import { setupApp } from "../setup-app";
import { db } from "../db";
import { ADMIN_LOGIN, ADMIN_PASSWORD } from "../settings/config";
import { SortBy, SortDirections } from "../common/types";
import {
  PAGE_DAFAULT,
  PAGE_SIZE_DAFAULT,
  SORT_DIRECTION_DAFAULT,
  SORT_FIELD_DAFAULT,
} from "../common/constants";
import { userQueryRepository } from "../users/repositories";
import { User } from "../users/types";

const app = express();

setupApp(app);

describe("GET /users", () => {
  let responseCreateData: User[] = [];
  let usersCount: number;

  beforeAll(async () => {
    await db.connect();

    await request(app).delete("/testing/all-data").expect(204);

    const ADMIN_LOGIN_PASSWORD = `${ADMIN_LOGIN}:${ADMIN_PASSWORD}`;
    const ADMIN_TOKEN = Buffer.from(ADMIN_LOGIN_PASSWORD, "utf-8").toString(
      "base64",
    );

    for (let i = 0; i < 21; i++) {
      const responseCreate = await request(app)
        .post("/users")
        .set("Authorization", `Basic ${ADMIN_TOKEN}`)
        .send({
          login: `login${i}`,
          password: "password",
          email: `example${i}@example.dev`,
        })
        .expect(201);

      responseCreateData.push(responseCreate.body);
    }

    responseCreateData.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    usersCount = await userQueryRepository.count();
  }, 30000);

  afterAll(async () => {
    await db.disconnect();
  });

  it("should return 200 and all users with default params queries", async () => {
    const response = await request(app).get("/users").expect(200);

    const page = PAGE_DAFAULT;
    const pageSize = PAGE_SIZE_DAFAULT;
    const pagesCount = Math.ceil(usersCount / PAGE_SIZE_DAFAULT);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: usersCount,
      items: responseCreateData.slice(startIndex, startIndex + pageSize),
    });

    const allUsers = await userQueryRepository.find({ page, pageSize });
    expect(allUsers.length).toBe(response.body.items.length);
  });

  it("should return 200 and all users with setting pageNumber and default pageSize in params queries", async () => {
    const page = 2;

    const response = await request(app)
      .get(`/users?pageNumber=${page}`)
      .expect(200);

    const pageSize = PAGE_SIZE_DAFAULT;
    const pagesCount = Math.ceil(usersCount / pageSize);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: usersCount,
      items: responseCreateData.slice(startIndex, startIndex + pageSize),
    });

    const allUsers = await userQueryRepository.find({ page, pageSize });
    expect(allUsers.length).toBe(response.body.items.length);
  });

  it("should return 200 and all users with setting pageSize and default pageNumber in params queries", async () => {
    const pageSize = 11;
    const response = await request(app)
      .get(`/users?pageSize=${pageSize}`)
      .expect(200);

    const page = PAGE_DAFAULT;
    const pagesCount = Math.ceil(usersCount / pageSize);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: usersCount,
      items: responseCreateData.slice(startIndex, startIndex + pageSize),
    });

    const allUsers = await userQueryRepository.find({ page, pageSize });
    expect(allUsers.length).toBe(response.body.items.length);
  });

  it("should return 200 and all users with setting pageNumber and pageSize params queries", async () => {
    const page = 2;
    const pageSize = 11;

    const response = await request(app)
      .get(`/users?pageNumber=${page}&pageSize=${pageSize}`)
      .expect(200);

    const pagesCount = Math.ceil(usersCount / pageSize);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: usersCount,
      items: responseCreateData.slice(startIndex, startIndex + pageSize),
    });

    const allUsers = await userQueryRepository.find({ page, pageSize });
    expect(allUsers.length).toBe(response.body.items.length);
  });

  it("should return 200 and all users with setting asc order. Other fields default", async () => {
    const sortDirection = SortDirections.ASC;

    const response = await request(app)
      .get(`/users?sortDirection=${sortDirection}`)
      .expect(200);

    const sortBy: SortBy<User> = SORT_FIELD_DAFAULT;

    const page = PAGE_DAFAULT;
    const pageSize = PAGE_SIZE_DAFAULT;
    const pagesCount = Math.ceil(usersCount / pageSize);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: usersCount,
      items: [...responseCreateData]
        .reverse()
        .slice(startIndex, startIndex + pageSize),
    });

    const allUsers = await userQueryRepository.find({
      page,
      pageSize,
      sortBy,
      sortDirection,
    });
    expect(allUsers.length).toBe(response.body.items.length);
  });

  it("should return 200 and all users with sorting by name. Other fields default", async () => {
    const sortBy: SortBy<User> = "login";

    const response = await request(app)
      .get(`/users?sortBy=${sortBy}`)
      .expect(200);

    const sortDirection = SORT_DIRECTION_DAFAULT;

    const page = PAGE_DAFAULT;
    const pageSize = PAGE_SIZE_DAFAULT;
    const pagesCount = Math.ceil(usersCount / pageSize);

    const startIndex = (page - 1) * pageSize;

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: usersCount,
      items: responseCreateData
        .sort((a, b) => b.login.localeCompare(a.login))
        .slice(startIndex, startIndex + pageSize),
    });

    const allUsers = await userQueryRepository.find({
      page,
      pageSize,
      sortBy,
      sortDirection,
    });
    expect(allUsers.length).toBe(response.body.items.length);
  });

  it("should return 200 and 1 users with login 'login10'. Other fields default", async () => {
    const searchLoginTerm: string = "login10";

    const response = await request(app)
      .get(`/users?searchLoginTerm=${searchLoginTerm}`)
      .expect(200);

    const page = PAGE_DAFAULT;
    const pageSize = PAGE_SIZE_DAFAULT;

    usersCount = await userQueryRepository.count(searchLoginTerm);

    const pagesCount = Math.ceil(usersCount / pageSize);

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: usersCount,
      items: [responseCreateData.find((el) => el.login === searchLoginTerm)],
    });

    expect(response.body.items.length).toBe(1);
  });

  it("should return 200 and 1 users with email 'example11@example.dev'. Other fields default", async () => {
    const searchEmailTerm: string = "example11@example.dev";

    const response = await request(app)
      .get(`/users?searchEmailTerm=${searchEmailTerm}`)
      .expect(200);

    const page = PAGE_DAFAULT;
    const pageSize = PAGE_SIZE_DAFAULT;

    usersCount = await userQueryRepository.count(null, searchEmailTerm);

    const pagesCount = Math.ceil(usersCount / pageSize);

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: usersCount,
      items: [responseCreateData.find((el) => el.email === searchEmailTerm)],
    });

    expect(response.body.items.length).toBe(1);
  });

  it("should return 200 and 2 users with login 'login10' and email 'example11@example.dev'. Other fields default", async () => {
    const searchLoginTerm: string = "login10";
    const searchEmailTerm: string = "example11@example.dev";

    const response = await request(app)
      .get(
        `/users?searchLoginTerm=${searchLoginTerm}&searchEmailTerm=${searchEmailTerm}`,
      )
      .expect(200);

    const page = PAGE_DAFAULT;
    const pageSize = PAGE_SIZE_DAFAULT;

    usersCount = await userQueryRepository.count(
      searchLoginTerm,
      searchEmailTerm,
    );

    const pagesCount = Math.ceil(usersCount / pageSize);

    expect(response.body).toEqual({
      pagesCount,
      page,
      pageSize,
      totalCount: usersCount,
      items: responseCreateData.filter(
        (el) => el.login === searchLoginTerm || el.email === searchEmailTerm,
      ),
    });

    expect(response.body.items.length).toBe(2);
  });
});
