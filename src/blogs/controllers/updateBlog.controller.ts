import { Request, Response } from "express";
import { BlogInputDto } from "../types";
import { APIErrorResult } from "../../common/types";
import { blogsService } from "../application/blogs.service";
import { NotFoundException } from "../../common/exceptions";

export const updateBlog = async (
  req: Request<{ id: string }, {}, BlogInputDto>,
  res: Response<APIErrorResult | null>,
) => {
  try {
    const blogData = req.body;
    const { id } = req.params;

    const result = await blogsService.update(id, blogData);

    if (result) {
      res.sendStatus(204);
    } else {
    }
  } catch (error) {
    if (error instanceof NotFoundException) {
      res.sendStatus(404);
    }
  }
};

// if (typeof id === "string") {
//     const blog = await blogRepository.findById(id);

//     if (!blog) {
//       res.sendStatus(404);
//       return;
//     }

//     next();
//   }
