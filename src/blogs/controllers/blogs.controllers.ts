import { Request, Response } from "express";
import { Blog, BlogInputDto, BlogsQuery } from "../types";
import { APIErrorResult, PaginatorData } from "../../common/types";
import { SavingException } from "../exceptions";
import { BlogsService } from "../application/blogs.service";
import { BlogsQueryRepository } from "../repositories";
import { NotFoundException } from "../../common/exceptions";
import { matchedData } from "express-validator";

export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  createBlog = async (
    req: Request<{}, {}, BlogInputDto>,
    res: Response<Blog | APIErrorResult>,
  ) => {
    const blog = req.body;

    try {
      const newBlogId = await this.blogsService.create(blog);

      const createdBlog = await this.blogsQueryRepository.findById(newBlogId);

      if (!createdBlog) throw new SavingException();

      return res.status(201).json(createdBlog);
    } catch (error) {
      return res.sendStatus(500);
    }
  };

  deleteBlog = async (req: Request<{ id: string }>, res: Response<null>) => {
    try {
      const { id } = req.params;

      await this.blogsService.delete(id);

      return res.sendStatus(204);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.sendStatus(404);
      }

      return res.sendStatus(500);
    }
  };

  getBlog = async (
    req: Request<{ id: string }>,
    res: Response<Blog | null>,
  ) => {
    try {
      const { id } = req.params;

      const result = await this.blogsService.findById(id);

      if (result) {
        return res.status(200).json(result);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.sendStatus(404);
      }

      return res.sendStatus(500);
    }
  };

  getBlogs = async (
    req: Request<{}, {}, {}, BlogsQuery>,
    res: Response<PaginatorData<Blog>>,
  ) => {
    try {
      const blogsQueries = matchedData<BlogsQuery>(req);

      const result = await this.blogsService.findMany(blogsQueries);

      return res.status(200).json(result);
    } catch (error) {
      return res.sendStatus(500);
    }
  };

  updateBlog = async (
    req: Request<{ id: string }, {}, BlogInputDto>,
    res: Response<APIErrorResult | null>,
  ) => {
    try {
      const blogData = req.body;
      const { id } = req.params;

      await this.blogsService.update(id, blogData);

      return res.sendStatus(204);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.sendStatus(404);
      }

      return res.sendStatus(500);
    }
  };
}
