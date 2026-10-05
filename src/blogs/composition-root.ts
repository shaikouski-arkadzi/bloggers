import { container } from "../settings/container";
import { BlogsController } from "./controllers/blogs.controllers";
import { BlogsService } from "./application/blogs.service";
import { BlogsCommandRepository, BlogsQueryRepository } from "./repositories";

export const blogsCommandRepository = new BlogsCommandRepository();
export const blogsQueryRepository = new BlogsQueryRepository();
export const blogsService = new BlogsService(
  blogsCommandRepository,
  blogsQueryRepository,
);
export const blogsController = new BlogsController(
  blogsService,
  blogsQueryRepository,
);

container.bind(BlogsCommandRepository).to(BlogsCommandRepository);
container.bind(BlogsQueryRepository).to(BlogsQueryRepository);

container.bind(BlogsService).to(BlogsService);

container.bind(BlogsController).to(BlogsController);
