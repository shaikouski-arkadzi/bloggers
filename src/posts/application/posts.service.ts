import { ObjectId } from "mongodb";
import { blogRepository } from "../../blogs/repositories";
import { PaginatorData } from "../../common/types";
import { postRepository } from "../repositories";
import { Post, PostDb, PostInputDto, PostsQuery, UpdatedPost } from "../types";
import { mapPostDbToPost } from "../utils";
import { blogsService } from "../../blogs/application/blogs.service";
import { NotFoundException } from "../../common/exceptions";

export const postsService = {
  async findById(id: string): Promise<Post> {
    const result = await postRepository.findById(id);

    if (!result) {
      throw new NotFoundException();
    }

    return mapPostDbToPost(result);
  },

  async create(post: PostInputDto): Promise<Post> {
    const blog = await blogsService.findById(post.blogId);

    if (!blog) throw new NotFoundException();

    const newPost: PostDb = {
      _id: new ObjectId(),
      title: post.title,
      content: post.content,
      shortDescription: post.shortDescription,
      blogId: post.blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    await postRepository.create(newPost);

    return mapPostDbToPost(newPost);
  },

  async findMany(queries: PostsQuery): Promise<PaginatorData<Post>> {
    const page = Number(queries.pageNumber);
    const pageSize = Number(queries.pageSize);
    const sortBy = queries.sortBy;
    const sortDirection = queries.sortDirection;

    const allPostsCount = await postRepository.count();

    const pagesCount = Math.ceil(allPostsCount / pageSize);

    const result = await postRepository.find({
      page,
      pageSize,
      sortBy,
      sortDirection,
    });

    const mappedResult = result.map(mapPostDbToPost);

    const returnData: PaginatorData<Post> = {
      pagesCount,
      page,
      pageSize,
      totalCount: allPostsCount,
      items: mappedResult,
    };

    return returnData;
  },

  async delete(id: string): Promise<boolean> {
    await postsService.findById(id);

    const result = await postRepository.delete(id);

    return result;
  },

  async update(id: string, post: PostInputDto): Promise<boolean> {
    await postsService.findById(id);

    const blog = await blogRepository.findById(post.blogId);

    if (!blog) throw new NotFoundException();

    const idDb = new ObjectId(id);

    const newPost: UpdatedPost = {
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: blog.name,
    };

    const result = await postRepository.update(idDb, newPost);

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

    const allPostsCount = await postRepository.count({
      blogId,
    });

    const pagesCount = Math.ceil(allPostsCount / pageSize);

    const result = await postRepository.findPostsByBlog(blogId, {
      page,
      pageSize,
      sortBy,
      sortDirection,
    });

    const mappedResult = result.map(mapPostDbToPost);

    const returnData: PaginatorData<Post> = {
      pagesCount,
      page,
      pageSize,
      totalCount: allPostsCount,
      items: mappedResult,
    };

    return returnData;
  },
};
