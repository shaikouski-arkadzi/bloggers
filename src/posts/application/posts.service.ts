import { inject, injectable } from "inversify";
import { PaginatorData } from "../../common/types";
import { Post, PostInputDto, PostsQuery, UpdatedPost } from "../types";
import { createPostDb, updatePostDb } from "../utils";
import { NotFoundException } from "../../common/exceptions";
import { BlogForPostNotExistException } from "../exceptions";
import { BlogsService } from "../../blogs/application/blogs.service";
import { PostsCommandRepository, PostsQueryRepository } from "../repositories";
import { BlogsQueryRepository } from "../../blogs/repositories";
import { PostModel } from "../db/post.model";

@injectable()
export class PostsService {
  constructor(
    @inject(PostsCommandRepository)
    private postsCommandRepository: PostsCommandRepository,

    @inject(PostsQueryRepository)
    private postsQueryRepository: PostsQueryRepository,

    @inject(BlogsQueryRepository)
    private blogsQueryRepository: BlogsQueryRepository,

    @inject(BlogsService)
    private blogsService: BlogsService,
  ) {}

  async findById(id: string): Promise<Post> {
    const result = await this.postsQueryRepository.findById(id);

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  async create(post: PostInputDto): Promise<string> {
    const blog = await this.blogsQueryRepository.findById(post.blogId);

    if (!blog) throw new BlogForPostNotExistException();

    const newPost = new PostModel(createPostDb(post, blog));

    const createdPostId = await this.postsCommandRepository.save(newPost);

    return createdPostId.toString();
  }

  async findMany(queries: PostsQuery): Promise<PaginatorData<Post>> {
    const page = Number(queries.pageNumber);
    const pageSize = Number(queries.pageSize);
    const sortBy = queries.sortBy;
    const sortDirection = queries.sortDirection;

    const allPostsCount = await this.postsQueryRepository.count();

    const pagesCount = Math.ceil(allPostsCount / pageSize);

    const result = await this.postsQueryRepository.find({
      page,
      pageSize,
      sortBy,
      sortDirection,
    });

    return {
      pagesCount,
      page,
      pageSize,
      totalCount: allPostsCount,
      items: result,
    };
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);

    await this.postsCommandRepository.delete(id);
  }

  async update(id: string, post: PostInputDto): Promise<void> {
    await this.findById(id);

    const blog = await this.blogsQueryRepository.findById(post.blogId);

    if (!blog) throw new BlogForPostNotExistException();

    const existingPost = await PostModel.findById(id);

    if (!existingPost) throw new NotFoundException();

    existingPost.title = post.title;
    existingPost.shortDescription = post.shortDescription;
    existingPost.content = post.content;

    await this.postsCommandRepository.save(existingPost);
  }

  async findManyByBlog(
    blogId: string,
    queries: PostsQuery,
  ): Promise<PaginatorData<Post>> {
    const page = Number(queries.pageNumber);
    const pageSize = Number(queries.pageSize);
    const sortBy = queries.sortBy;
    const sortDirection = queries.sortDirection;

    await this.blogsService.findById(blogId);

    const allPostsCount = await this.postsQueryRepository.count({
      blogId,
    });

    const pagesCount = Math.ceil(allPostsCount / pageSize);

    const result = await this.postsQueryRepository.findPostsByBlog(blogId, {
      page,
      pageSize,
      sortBy,
      sortDirection,
    });

    return {
      pagesCount,
      page,
      pageSize,
      totalCount: allPostsCount,
      items: result,
    };
  }
}
