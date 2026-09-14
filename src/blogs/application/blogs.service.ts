import { ObjectId } from "mongodb";
import { blogsCommandRepository, blogsQueryRepository } from "../repositories";
import { createBlogDb, mapBlogDbToBlog } from "../utils";
import { Blog, BlogDb, BlogInputDto, BlogsQuery } from "../types";
import { PaginatorData } from "../../common/types";
import { NotFoundException } from "../../common/exceptions";

export const blogsService = {
  async findById(id: string): Promise<Blog> {
    const result = await blogsQueryRepository.findById(id);

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  },

  async create(blog: BlogInputDto): Promise<string> {
    const newBlogInDb = createBlogDb(blog);

    const blogId = await blogsCommandRepository.create(newBlogInDb);

    return blogId.toString();
  },

  async findMany(queries: BlogsQuery): Promise<PaginatorData<Blog>> {
    const page = Number(queries.pageNumber);
    const pageSize = Number(queries.pageSize);
    const sortBy = queries.sortBy;
    const sortDirection = queries.sortDirection;
    const searchNameTerm = queries.searchNameTerm;

    const allBlogsCount = await blogsQueryRepository.count(
      searchNameTerm ? { name: searchNameTerm } : {},
    );

    const pagesCount = Math.ceil(allBlogsCount / pageSize);

    const result = await blogsQueryRepository.find({
      page,
      pageSize,
      sortBy,
      sortDirection,
      searchNameTerm,
    });

    const returnData: PaginatorData<Blog> = {
      pagesCount,
      page,
      pageSize,
      totalCount: allBlogsCount,
      items: result,
    };

    return returnData;
  },

  async delete(id: string): Promise<boolean> {
    await blogsService.findById(id);

    const result = await blogsCommandRepository.delete(id);

    return result === 1;
  },

  async update(id: string, blog: BlogInputDto): Promise<void> {
    await blogsService.findById(id);

    await blogsCommandRepository.update(id, blog);
  },
};
