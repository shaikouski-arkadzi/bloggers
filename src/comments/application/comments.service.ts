import { PaginatorData } from "../../common/types";
import { postsService } from "../../posts/application/posts.service";
import { commentsQueryRepository } from "../repositories";
import { Comment, CommentsQuery } from "../types";

export const commentsService = {
  async findManyByPost(
    postId: string,
    queries: CommentsQuery,
  ): Promise<PaginatorData<Comment>> {
    const page = Number(queries.pageNumber);
    const pageSize = Number(queries.pageSize);
    const sortBy = queries.sortBy;
    const sortDirection = queries.sortDirection;

    await postsService.findById(postId);

    const allCommentsCount = await commentsQueryRepository.count();

    const pagesCount = Math.ceil(allCommentsCount / pageSize);

    const result = await commentsQueryRepository.findCommentsByPost(postId, {
      page,
      pageSize,
      sortBy,
      sortDirection,
    });

    const returnData: PaginatorData<Comment> = {
      pagesCount,
      page,
      pageSize,
      totalCount: allCommentsCount,
      items: result,
    };

    return returnData;
  },
};
