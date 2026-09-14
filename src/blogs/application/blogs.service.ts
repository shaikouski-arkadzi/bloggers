import { ObjectId } from "mongodb";
import { blogsCommandRepository, blogsQueryRepository } from "../repositories";
import { mapBlogDbToBlog } from "../utils";
import { Blog, BlogDb, BlogInputDto, BlogsQuery } from "../types";
import { PaginatorData } from "../../common/types";
import { NotFoundException } from "../../common/exceptions";

export const blogsService = {
  async findById(id: string): Promise<Blog> {
    const result = await blogsQueryRepository.findById(id);

    if (!result) {
      throw new NotFoundException();
    }

    return mapBlogDbToBlog(result);
  },

  async create(blog: BlogInputDto): Promise<Blog> {
    const newBlogInDb: BlogDb = {
      _id: new ObjectId(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };

    await blogsCommandRepository.create(newBlogInDb);

    return mapBlogDbToBlog(newBlogInDb);
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

    const mappedResult = result.map(mapBlogDbToBlog);

    const returnData: PaginatorData<Blog> = {
      pagesCount,
      page,
      pageSize,
      totalCount: allBlogsCount,
      items: mappedResult,
    };

    return returnData;
  },

  async delete(id: string): Promise<boolean> {
    await blogsService.findById(id);

    const result = await blogsCommandRepository.delete(id);

    return result === 1;
  },

  async update(id: string, blog: BlogInputDto): Promise<boolean> {
    await blogsService.findById(id);

    const idDB = new ObjectId(id);

    const newBlog: BlogInputDto = {
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
    };

    const result = await blogsCommandRepository.update(idDB, newBlog);

    return result === 1;
  },
};
