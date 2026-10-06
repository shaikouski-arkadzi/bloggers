import { BlogsService } from "../blogs/application/blogs.service";
import { BlogsQueryRepository } from "../blogs/repositories";
import { container } from "../settings/container";
import { PostsService } from "./application/posts.service";
import { PostsController } from "./controllers/posts.controllers";
import { PostsCommandRepository, PostsQueryRepository } from "./repositories";

const blogsQueryRepository = container.get(BlogsQueryRepository);
const blogsService = container.get(BlogsService);

export const postsCommandRepository = new PostsCommandRepository();
export const postsQueryRepository = new PostsQueryRepository();

export const postsService = new PostsService(
  postsCommandRepository,
  postsQueryRepository,
  blogsQueryRepository,
  blogsService,
);

export const postsController = new PostsController(
  postsService,
  postsQueryRepository,
);
