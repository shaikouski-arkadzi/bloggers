import { ObjectId } from "mongodb";
import { jwtService } from "../../auth/application";
import { UnauthorizedException } from "../../auth/exceptions";
import { PaginatorData } from "../../common/types";
import { postsService } from "../../posts/application/posts.service";
import { userService } from "../../users/application";
import {
  commentsCommandRepository,
  commentsQueryRepository,
} from "../repositories";
import { Comment, CommentDb, CommentsQuery } from "../types";

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

  async create(
    auth: string,
    postId: string,
    content: string,
  ): Promise<Comment | null> {
    const [_, token] = auth.split(" ");

    const decoded = await jwtService.decodeToken(token);

    if (!decoded) throw new UnauthorizedException();

    const userObjectId = new ObjectId(decoded.uuid);

    const user = await userService.getUserById(userObjectId);

    if (!user) throw new UnauthorizedException();

    const payload: CommentDb = {
      content,
      commentatorInfo: {
        userId: decoded.uuid,
        userLogin: user.login,
      },
      createdAt: new Date().toISOString(),
      postId: new ObjectId(postId),
    };

    const commentId = await commentsCommandRepository.create(payload);

    const comment = await commentsQueryRepository.findByField({
      _id: commentId,
    });

    return comment;
  },
};
