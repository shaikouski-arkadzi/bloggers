import request from "supertest";
import express from "express";
import router from "../routes";
import { db } from "../../db";

const app = express();

app.use(express.json());
app.use("/blogs", router);

describe("GET /blogs", () => {
  it("should return 200 and all videos", async () => {
    const response = await request(app).get("/blogs").expect(200);

    expect(response.body).toEqual(db.blogs);
  });
});