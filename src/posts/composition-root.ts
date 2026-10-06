import { container } from "../settings/container";
import { PostsService } from "./application/posts.service";
import { PostsController } from "./controllers/posts.controllers";
import { PostsCommandRepository, PostsQueryRepository } from "./repositories";

container.bind(PostsCommandRepository).to(PostsCommandRepository);
container.bind(PostsQueryRepository).to(PostsQueryRepository);

container.bind(PostsService).to(PostsService);

container.bind(PostsController).to(PostsController);

export const postsController = container.get(PostsController);
