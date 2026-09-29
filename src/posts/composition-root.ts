import { blogsQueryRepository, blogsService } from "../blogs/composition-root";
import { PostsService } from "./application/posts.service";
import { PostsController } from "./controllers/posts.controllers";
import { PostsCommandRepository, PostsQueryRepository } from "./repositories";

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
