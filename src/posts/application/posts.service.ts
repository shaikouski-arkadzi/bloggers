import { ObjectId } from "mongodb";
import { blogRepository } from "../../blogs/repositories";
import { PaginatorData } from "../../common/types";
import { postRepository } from "../repositories";
import { Post, PostDb, PostInputDto, PostsQuery, UpdatedPost } from "../types";
import { mapPostDbToPost } from "../utils";

export const postsService = {
  async findById(id: string): Promise<Post | null> {
    const result = await postRepository.findById(id);

    if (!result) {
      return null;
    }

    return mapPostDbToPost(result);
  },

  async create(post: PostInputDto): Promise<Post | Error> {
    const blog = await blogRepository.findById(post.blogId);

    if (!blog) throw new Error("Не найдено блога с таким id");

    const newPost: PostDb = {
      _id: new ObjectId(),
      title: post.title,
      content: post.content,
      shortDescription: post.shortDescription,
      blogId: post.blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    const result = await postRepository.create(newPost);

    if (result) {
      return mapPostDbToPost(newPost);
    } else {
      throw new Error("Ошибка создания поста");
    }
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
};
