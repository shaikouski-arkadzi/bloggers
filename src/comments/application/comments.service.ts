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
import { Comment, CommentDb, CommentInputModel, CommentsQuery } from "../types";
import { NotFoundException } from "../../common/exceptions";
import { PermissionException } from "../exceptions";

export const commentsService = {
  async getCommentById(id: string): Promise<Comment | null> {
    const commentObjectId = new ObjectId(id);
    const comment = await commentsQueryRepository.findByField({
      _id: commentObjectId,
    });
    return comment;
  },

  async findManyByPost(
    postId: string,
    queries: CommentsQuery,
  ): Promise<PaginatorData<Comment>> {
    const page = Number(queries.pageNumber);
    const pageSize = Number(queries.pageSize);
    const sortBy = queries.sortBy;
    const sortDirection = queries.sortDirection;

    await postsService.findById(postId);

    const allCommentsCount = await commentsQueryRepository.count({ postId });

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

    await postsService.findById(postId);

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

  async update(
    userId: string,
    commentId: string,
    commentInput: CommentInputModel,
  ): Promise<boolean> {
    const user = await userService.getUserById(new ObjectId(userId));

    if (!user) throw new UnauthorizedException();

    const comment = await commentsService.getCommentById(commentId);

    if (!comment) throw new NotFoundException();

    if (comment.commentatorInfo.userId !== userId)
      throw new PermissionException();

    const result = await commentsCommandRepository.update(
      commentId,
      commentInput,
    );

    return result === 1;
  },

  async delete(userId: string, commentId: string): Promise<boolean | Error> {
    const user = await userService.getUserById(new ObjectId(userId));

    if (!user) throw new UnauthorizedException();

    const comment = await commentsService.getCommentById(commentId);

    if (!comment) throw new NotFoundException();

    if (comment.commentatorInfo.userId !== userId)
      throw new PermissionException();

    const result = await commentsCommandRepository.delete(commentId);

    return result === 1;
  },
};
