import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { matchedData } from "express-validator";
import {
  APIErrorResult,
  LikeInputModel,
  PaginatorData,
} from "../../common/types";
import { Post, PostInputDto, PostsQuery } from "../types";
import { NotFoundException } from "../../common/exceptions";
import { BlogForPostNotExistException, SavingException } from "../exceptions";
import { PostsService } from "../application/posts.service";
import { PostsQueryRepository } from "../repositories";
import { LikeStatus } from "../../common/constants";
import { mapPostWithMyStatus } from "../utils";
import { UnauthorizedException } from "../../auth/exceptions";

type RequestBody = Omit<PostInputDto, "blogId">;

@injectable()
export class PostsController {
  constructor(
    @inject(PostsService)
    private postsService: PostsService,

    @inject(PostsQueryRepository)
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  createBlogPost = async (
    req: Request<{ id: string }, {}, RequestBody>,
    res: Response<Post | APIErrorResult>,
  ) => {
    try {
      const blogId = req.params.id;
      const post = req.body;

      const payload: PostInputDto = {
        ...post,
        blogId,
      };

      const createdPostId = await this.postsService.create(payload);

      const createdPost =
        await this.postsQueryRepository.findById(createdPostId);

      if (!createdPost) throw new SavingException();

      return res.status(201).json(createdPost);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BlogForPostNotExistException
      ) {
        return res.sendStatus(404);
      }

      return res.sendStatus(500);
    }
  };

  createPost = async (
    req: Request<{}, {}, PostInputDto>,
    res: Response<Post | APIErrorResult>,
  ) => {
    try {
      const post = req.body;

      const createdPostId = await this.postsService.create(post);

      const createdPost =
        await this.postsQueryRepository.findById(createdPostId);

      if (!createdPost) throw new SavingException();

      return res.status(201).json(createdPost);
    } catch (error) {
      if (error instanceof BlogForPostNotExistException) {
        return res.status(400).json({
          errorsMessages: [
            {
              message: "Не найдено блога с таким идентификатором",
              field: "blogId",
            },
          ],
        });
      }

      return res.sendStatus(500);
    }
  };

  deletePost = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const { id } = req.params;

      await this.postsService.delete(id);

      return res.sendStatus(204);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.sendStatus(404);
      }

      return res.sendStatus(500);
    }
  };

  getBlogPosts = async (
    req: Request<{ id: string }, {}, {}, PostsQuery>,
    res: Response<PaginatorData<Post>>,
  ) => {
    try {
      const id = req.params.id;

      const postsQueries = matchedData<PostsQuery>(req);

      const result = await this.postsService.findManyByBlog(id, postsQueries);

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.sendStatus(404);
      }

      return res.sendStatus(500);
    }
  };

  getPost = async (
    req: Request<{ id: string }>,
    res: Response<Post | null>,
  ) => {
    try {
      const userId = req.auth?.userId;
      const { id } = req.params;

      let post = await this.postsService.findById(id);

      if (userId) {
        const likeStatus =
          await this.postsQueryRepository.findLikeByUserAndPost(userId, id);

        post = mapPostWithMyStatus(post, likeStatus ?? LikeStatus.NONE);
      }

      return res.status(200).json(post);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.sendStatus(404);
      }

      return res.sendStatus(500);
    }
  };

  getPosts = async (
    req: Request<{}, {}, {}, PostsQuery>,
    res: Response<PaginatorData<Post>>,
  ) => {
    const userId = req.auth?.userId ?? null;

    try {
      const postsQueries = matchedData<PostsQuery>(req);

      const result = await this.postsService.findMany(postsQueries, userId);

      return res.status(200).json(result);
    } catch (error) {
      return res.sendStatus(500);
    }
  };

  updatePost = async (
    req: Request<{ id: string }, {}, PostInputDto>,
    res: Response<APIErrorResult | null>,
  ) => {
    try {
      const post = req.body;
      const { id } = req.params;

      await this.postsService.update(id, post);

      return res.sendStatus(204);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.sendStatus(404);
      }

      if (error instanceof BlogForPostNotExistException) {
        return res.status(400).json({
          errorsMessages: [
            {
              message: "Не найдено блога с таким идентификатором",
              field: "blogId",
            },
          ],
        });
      }

      return res.sendStatus(500);
    }
  };

  setLikeStatus = async (
    req: Request<{ id: string }, {}, LikeInputModel>,
    res: Response<PaginatorData<Comment>>,
  ) => {
    try {
      const { likeStatus } = req.body;
      const postId = req.params.id;
      const userId = req.auth.userId;

      if (!userId) throw new UnauthorizedException();

      await this.postsService.setLike(userId, postId, likeStatus);

      return res.sendStatus(204);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return res.sendStatus(401);
      }
      if (error instanceof NotFoundException) {
        return res.sendStatus(404);
      }

      return res.sendStatus(500);
    }
  };
}
