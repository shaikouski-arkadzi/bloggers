import { BlogsService } from "./application/blogs.service";
import { BlogsCommandRepository, BlogsQueryRepository } from "./repositories";

export const blogsCommandRepository = new BlogsCommandRepository();
export const blogsQueryRepository = new BlogsQueryRepository();
export const blogsService = new BlogsService();
