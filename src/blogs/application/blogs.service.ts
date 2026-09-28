import { createBlogDb } from "../utils";
import { Blog, BlogInputDto, BlogsQuery } from "../types";
import { PaginatorData } from "../../common/types";
import { NotFoundException } from "../../common/exceptions";
import { BlogsCommandRepository, BlogsQueryRepository } from "../repositories";

export class BlogsService {
  constructor(
    private blogsCommandRepository: BlogsCommandRepository,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async findById(id: string): Promise<Blog> {
    const result = await this.blogsQueryRepository.findById(id);

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  async create(blog: BlogInputDto): Promise<string> {
    const newBlogInDb = createBlogDb(blog);

    const blogId = await this.blogsCommandRepository.create(newBlogInDb);

    return blogId.toString();
  }

  async findMany(queries: BlogsQuery): Promise<PaginatorData<Blog>> {
    const page = Number(queries.pageNumber);
    const pageSize = Number(queries.pageSize);
    const sortBy = queries.sortBy;
    const sortDirection = queries.sortDirection;
    const searchNameTerm = queries.searchNameTerm;

    const allBlogsCount = await this.blogsQueryRepository.count(
      searchNameTerm ? { name: searchNameTerm } : {},
    );

    const pagesCount = Math.ceil(allBlogsCount / pageSize);

    const result = await this.blogsQueryRepository.find({
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
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);

    await this.blogsCommandRepository.delete(id);
  }

  async update(id: string, blog: BlogInputDto): Promise<void> {
    await this.findById(id);

    await this.blogsCommandRepository.update(id, blog);
  }
}
