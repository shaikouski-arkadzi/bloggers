import { ObjectId } from "mongodb";
import { postsCommandRepository, postsQueryRepository } from "../repositories";
import { PaginatorData } from "../../common/types";
import { blogsQueryRepository } from "../../blogs/repositories";
import { Post, PostDb, PostInputDto, PostsQuery, UpdatedPost } from "../types";
import { createPostDb, mapPostDbToPost } from "../utils";
import { blogsService } from "../../blogs/application/blogs.service";
import { NotFoundException } from "../../common/exceptions";
import { BlogForPostNotExistException } from "../exceptions";

export const postsService = {
  async findById(id: string): Promise<Post> {
    const result = await postsQueryRepository.findById(id);

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  },

  async create(post: PostInputDto): Promise<string> {
    const blog = await blogsQueryRepository.findById(post.blogId);

    if (!blog) throw new BlogForPostNotExistException();

    const newPost = createPostDb(post, blog);

    const createdPostId = await postsCommandRepository.create(newPost);

    return createdPostId.toString();
  },

  async findMany(queries: PostsQuery): Promise<PaginatorData<Post>> {
    const page = Number(queries.pageNumber);
    const pageSize = Number(queries.pageSize);
    const sortBy = queries.sortBy;
    const sortDirection = queries.sortDirection;

    const allPostsCount = await postsQueryRepository.count();

    const pagesCount = Math.ceil(allPostsCount / pageSize);

    const result = await postsQueryRepository.find({
      page,
      pageSize,
      sortBy,
      sortDirection,
    });

    const returnData: PaginatorData<Post> = {
      pagesCount,
      page,
      pageSize,
      totalCount: allPostsCount,
      items: result,
    };

    return returnData;
  },

  async delete(id: string): Promise<boolean> {
    await postsService.findById(id);

    const result = await postsCommandRepository.delete(id);

    return result;
  },

  async update(id: string, post: PostInputDto): Promise<boolean> {
    await postsService.findById(id);

    const blog = await blogsQueryRepository.findById(post.blogId);

    if (!blog) throw new NotFoundException();

    const idDb = new ObjectId(id);

    const newPost: UpdatedPost = {
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: blog.name,
    };

    const result = await postsCommandRepository.update(idDb, newPost);

    return result === 1;
  },

  async findManyByBlog(
    blogId: string,
    queries: PostsQuery,
  ): Promise<PaginatorData<Post>> {
    const page = Number(queries.pageNumber);
    const pageSize = Number(queries.pageSize);
    const sortBy = queries.sortBy;
    const sortDirection = queries.sortDirection;

    await blogsService.findById(blogId);

    const allPostsCount = await postsQueryRepository.count({
      blogId,
    });

    const pagesCount = Math.ceil(allPostsCount / pageSize);

    const result = await postsQueryRepository.findPostsByBlog(blogId, {
      page,
      pageSize,
      sortBy,
      sortDirection,
    });

    const returnData: PaginatorData<Post> = {
      pagesCount,
      page,
      pageSize,
      totalCount: allPostsCount,
      items: result,
    };

    return returnData;
  },
};
