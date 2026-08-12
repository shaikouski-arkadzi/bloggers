import { ObjectId } from "mongodb";
import { blogRepository } from "../repositories";
import { mapBlogDbToBlog } from "../utils";
import { Blog, BlogDb, BlogInputDto, BlogsQuery } from "../types";
import { PaginatorData } from "../../common/types";

export const blogsService = {
  async findById(id: string): Promise<Blog | null> {
    const result = await blogRepository.findById(id);

    if (!result) {
      return null;
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

    await blogRepository.create(newBlogInDb);

    return mapBlogDbToBlog(newBlogInDb);
  },

  async findMany(queries: BlogsQuery): Promise<PaginatorData<Blog>> {
    const page = Number(queries.pageNumber);
    const pageSize = Number(queries.pageSize);
    const sortBy = queries.sortBy;
    const sortDirection = queries.sortDirection;
    const searchNameTerm = queries.searchNameTerm;

    const allBlogsCount = await blogRepository.count(
      searchNameTerm ? { name: searchNameTerm } : {},
    );

    const pagesCount = Math.ceil(allBlogsCount / pageSize);

    const result = await blogRepository.find({
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
};
