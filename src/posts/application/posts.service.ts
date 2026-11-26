import { inject, injectable } from "inversify";
import { PaginatorData, TLikeStatus } from "../../common/types";
import { Post, PostInputDto, PostsQuery } from "../types";
import { NotFoundException } from "../../common/exceptions";
import { BlogForPostNotExistException } from "../exceptions";
import { BlogsService } from "../../blogs/application/blogs.service";
import { PostsCommandRepository, PostsQueryRepository } from "../repositories";
import { BlogsCommandRepository } from "../../blogs/repositories";
import { PostModel } from "../db/post.model";
import { mapPostDbToPost, mapPostWithMyStatus } from "../utils";
import { LikePostModel } from "../db/likePost.model";
import { booleanToLikeStatus } from "../../common/utils/booleanToLikeStatus";

@injectable()
export class PostsService {
  constructor(
    @inject(PostsCommandRepository)
    private postsCommandRepository: PostsCommandRepository,

    @inject(PostsQueryRepository)
    private postsQueryRepository: PostsQueryRepository,

    @inject(BlogsCommandRepository)
    private blogsCommandRepository: BlogsCommandRepository,

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
    const blog = await this.blogsCommandRepository.findById(post.blogId);

    if (!blog) throw new BlogForPostNotExistException();

    const newPost = PostModel.createPost(post, blog);

    const createdPostId = await this.postsCommandRepository.save(newPost);

    return createdPostId.toString();
  }

  async findMany(
    queries: PostsQuery,
    userId: string | null,
  ): Promise<PaginatorData<Post>> {
    // CHECK
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

    const items: Post[] = [];

    for (const post of result) {
      if (!userId) {
        items.push(post);
        continue;
      }

      const userPostStatus =
        await this.postsQueryRepository.findLikeByUserAndPost(userId, post.id);

      if (!userPostStatus) {
        items.push(post);
        continue;
      }

      items.push(mapPostWithMyStatus(post, userPostStatus));
    }

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

    const blog = await this.blogsCommandRepository.findById(post.blogId);

    if (!blog) throw new BlogForPostNotExistException();

    const existingPost = await PostModel.findById(id);

    if (!existingPost) throw new NotFoundException();

    existingPost.updatePost(post);

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

  async setLike(
    userId: string,
    postId: string,
    likeStatus: TLikeStatus,
  ): Promise<void> {
    //TODO: check

    const post = await this.postsCommandRepository.findById(postId);

    if (!post) throw new NotFoundException();

    let likeModel =
      await this.postsCommandRepository.findLikeStatusByUserAndPost(
        userId,
        postId,
      );

    if (!likeModel && (likeStatus === "Like" || likeStatus === "Dislike")) {
      likeModel = LikePostModel.createLikeStatus(userId, postId, likeStatus);

      await this.postsCommandRepository.saveLike(likeModel);

      if (likeStatus === "Like") {
        post.increaseLikeCount();
      }

      if (likeStatus === "Dislike") {
        post.increaseDislikeCount();
      }
    }

    if (!likeModel) {
      console.error("likeModel error");
      throw new Error();
    }

    const previousLike = booleanToLikeStatus(likeModel.like);

    if (previousLike && likeStatus !== previousLike) {
      if (likeStatus === "Like" || likeStatus === "Dislike") {
        likeModel.updateLikeStatus(likeStatus);

        await this.postsCommandRepository.saveLike(likeModel);
      }

      if (likeStatus === "None") {
        await this.postsCommandRepository.deleteLikeStatus(userId, postId);
      }

      if (likeStatus === "Like" && previousLike === "Dislike") {
        post.decreaseDislikeCount();
        post.increaseLikeCount();
      }

      if (likeStatus === "Dislike" && previousLike === "Like") {
        post.decreaseLikeCount();
        post.increaseDislikeCount();
      }

      if (likeStatus === "None") {
        if (previousLike === "Like") {
          post.decreaseLikeCount();
        }
        if (previousLike === "Dislike") {
          post.decreaseDislikeCount();
        }
      }
    }
    await this.postsCommandRepository.save(post);
  }
}
