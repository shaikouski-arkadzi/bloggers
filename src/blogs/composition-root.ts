import { container } from "../settings/container";
import { BlogsController } from "./controllers/blogs.controllers";
import { BlogsService } from "./application/blogs.service";
import { BlogsCommandRepository, BlogsQueryRepository } from "./repositories";

container.bind(BlogsCommandRepository).to(BlogsCommandRepository);
container.bind(BlogsQueryRepository).to(BlogsQueryRepository);

container.bind(BlogsService).to(BlogsService);

container.bind(BlogsController).to(BlogsController);

export const blogsController = container.get(BlogsController);

export const blogsQueryRepository = container.get(BlogsQueryRepository);
